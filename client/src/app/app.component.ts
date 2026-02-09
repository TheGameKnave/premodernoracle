import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { toJpeg, getFontEmbedCSS } from 'html-to-image';
import * as JSZip from 'jszip';

export interface CardFormattingOptions {
  mpcBleed?: boolean;
  borderColor?: string|number;
  roundedCorners?: boolean;
  highRes?: boolean;
  modernFlourish?: boolean;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('textarea') textRef: ElementRef = new ElementRef(null);
  loading = false;
  exporting = false;
  exportProgress = 0;
  exportTotal = 0;
  cardsTooMany = false;
  
  Object = Object;
  Array = Array;
  title = 'premodern-oracle';
  
  cardField: UntypedFormControl = new UntypedFormControl();
  cardFormatting: UntypedFormGroup = new UntypedFormGroup({
    'mpcBleed': new UntypedFormControl(false),
    'borderColor': new UntypedFormControl('111'),
    'roundedCorners': new UntypedFormControl(false),
    'highRes': new UntypedFormControl(false),
    'modernFlourish': new UntypedFormControl(true),
  });
  cardFormattingOptions: CardFormattingOptions = {}
  cardFieldSub: Subscription | undefined;
  cardFormattingSub: Subscription | undefined;
  cardList: string[] = [];
  cardData: any[] = [];
  missingCards: string[] = [];

  constructor(
    private cookieService: CookieService,
  ) {}

  ngOnInit() {
    this.cardFieldSub = this.cardField.valueChanges.subscribe((value: string) => {
      this.cardList = value.split(/\r?\n/)
      // remove any leading numbers and spaces, and any trailing spaces
      this.cardList = this.cardList
        .map(card => card.replace(/^\d+|\s+$/g, '').trim())
        .filter(card => card)
      // dedup the list
      this.cardList = this.cardList.filter(
        (card, index) =>
          this.cardList.indexOf(card) === index
          && !card.toLowerCase().includes('sideboard')
          && card !== 'Deck' && card !== 'Deck:'
      );
      this.cardsTooMany = this.cardList.length > 100;
    });

    Object.keys(this.cardFormatting.controls).forEach(cookieName => {
      const cookieValue = this.cookieService.get(cookieName);
      if (cookieValue) {
        let formValue;
        if(cookieValue === 'false') formValue = false;
        else if(cookieValue === 'true') formValue = true;
        else formValue = cookieValue;
        this.cardFormatting.get(cookieName)?.setValue(formValue);
      }
    });

    this.cardFormattingOptions = this.cardFormatting.value;
    this.cardFormattingSub = this.cardFormatting.valueChanges.subscribe((value) => {
      Object.keys(value).forEach((key) => {
        this.cookieService.set(key, value[key], 365, '/');
      });
      this.cardFormattingOptions = value;
    });
  }

  ngAfterViewInit() {            
    this.textRef.nativeElement.focus();
    this.adjustTextboxSize()
  }

  adjustTextboxSize() {
    let textarea = document.getElementsByTagName('textarea')[0];
    if (textarea) {
      textarea.addEventListener('input', () => {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
      })

      // Initialize the textarea height
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }



  // method to fetch cards based on form contents
  async fetchCards() {
    this.loading = true;
    this.cardData = [];
    this.cardField.setValue(this.cardList.join('\n'));
    if(this.cardList.length <= 100){
      fetch('/api/cards', {
        method: 'POST', // Update the method to 'POST'
        headers: {
          'Content-Type': 'application/json', // Set the content type header if sending JSON payload
        },
        body: JSON.stringify({ cardList: this.cardList }), // Include your payload data here
      })
        .then(response => response.json())
        .then((cards: any[]) => {
          this.loading = false;
          this.cardData = cards;
          this.missingCards = Object.entries(cards)
            .filter(([key, value]) => key !== 'cardList' && !Object.keys(value).length)
            .map(([key, value]) => key)
        })
        .catch(error => {
          this.loading = false;
          console.error('Fetch error:', error)
        })
    }
  }

  /** Convert an external image URL to a data URL via server proxy */
  private async toDataUrl(url: string): Promise<string> {
    const proxied = `/api/image-proxy?url=${encodeURIComponent(url)}`;
    const resp = await fetch(proxied);
    const blob = await resp.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  /** Cache of already-proxied image URLs to avoid re-fetching */
  private imageCache = new Map<string, string>();

  private async inlineImages(container: HTMLElement): Promise<{ el: HTMLElement; origBg: string }[]> {
    const restored: { el: HTMLElement; origBg: string }[] = [];
    const bgEls = container.querySelectorAll<HTMLElement>('.cardImage, [class*="splitCardImage"]');
    for (const bgEl of Array.from(bgEls)) {
      const bgUrl = bgEl.style.backgroundImage.replace(/^url\(["']?|["']?\)$/g, '');
      if (bgUrl && bgUrl.startsWith('http')) {
        try {
          let dataUrl = this.imageCache.get(bgUrl);
          if (!dataUrl) {
            dataUrl = await this.toDataUrl(bgUrl);
            this.imageCache.set(bgUrl, dataUrl);
          }
          restored.push({ el: bgEl, origBg: bgEl.style.backgroundImage });
          bgEl.style.backgroundImage = `url(${dataUrl})`;
        } catch { /* leave original if fetch fails */ }
      }
    }
    return restored;
  }

  async exportCards() {
    const cards = document.querySelectorAll<HTMLElement>('.cardBorder');
    if (!cards.length) return;

    this.exporting = true;
    this.exportProgress = 0;
    this.exportTotal = cards.length;
    this.imageCache.clear();

    // Compute font CSS once and reuse for every card
    const fontEmbedCSS = await getFontEmbedCSS(cards[0]);

    const zip = new JSZip();
    let index = 0;

    for (const el of Array.from(cards)) {
      const isOverlay = el.closest('.overlay') !== null;
      const isMpc = el.classList.contains('mpc');
      // Card dimensions + 4px for the 2px border on each side
      const width = (isMpc ? 812 : 740) + 4;
      const height = (isMpc ? 1106 : 1034) + 4;

      // Inline external images for this card only
      const inlined = await this.inlineImages(el);

      // Temporarily remove zoom for capture
      const origZoom = el.style.getPropertyValue('zoom');
      (el.style as any).zoom = '1';

      try {
        const dataUrl = await toJpeg(el, {
          width, height,
          pixelRatio: 1,
          quality: 0.92,
          fontEmbedCSS,
        });
        // Convert data URL to raw bytes immediately to free the data URL string
        const binary = atob(dataUrl.split(',')[1]);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

        // Build filename from the card's title text
        const titleEl = el.querySelector('.cardTitle') || el.querySelector('.splitCardTitle');
        let name = titleEl?.textContent?.trim() || `card_${index}`;
        const splitTitles = el.querySelectorAll('.splitCardTitle');
        if (splitTitles.length === 2) {
          name = Array.from(splitTitles).map(t => t.textContent?.trim()).join(' -- ');
        }
        name = name.replace(/[^a-zA-Z0-9 ,'-]/g, '').trim();
        if (isOverlay) name += '_overlay';

        zip.file(`${name}.jpg`, bytes);
      } catch (err) {
        console.error('Failed to export card:', err);
      } finally {
        (el.style as any).zoom = origZoom;
      }

      // Restore original background-image URLs for this card
      for (const { el: bgEl, origBg } of inlined) {
        bgEl.style.backgroundImage = origBg;
      }

      index++;
      this.exportProgress = index;

      // Yield to the browser so the UI stays responsive
      await new Promise(r => setTimeout(r, 0));
    }

    this.imageCache.clear();

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(zipBlob);
    a.download = 'cards.zip';
    a.click();
    URL.revokeObjectURL(a.href);
    this.exporting = false;
  }
}

