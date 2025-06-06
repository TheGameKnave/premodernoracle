
export const wubrg = ['W', 'U', 'B', 'R', 'G'];
export const lands = ['Plains', 'Island', 'Swamp', 'Mountain', 'Forest'];
type SymbolType = {
  [key: string]: string;
}
export const symbols: SymbolType = {
  'T': '<span class="manaGeneric">o</span>T',
  'Q': '<span class="manaGeneric">o</span>Q',
  'E': '<span class="manaEnergy"></span>',
  'S': '<span class="manaSnow">o</span>V',
  'C': '<span class="manaGeneric">o</span><span class="manaColorless"></span>',
  'W': '<span class="manaWhite">o</span>W',
  'U': '<span class="manaBlue">o</span>U',
  'B': '<span class="manaBlack">o</span>B',
  'R': '<span class="manaRed">o</span>R',
  'G': '<span class="manaGreen">o</span>G',

  //Hybrid
  'W/U': '<span class="manaWhite">O</span><span class="manaBlue">/</span>Pi',
  'U/W': '<span class="manaBlue">O</span><span class="manaWhite">/</span>Ip',
  'W/B': '<span class="manaWhite">O</span><span class="manaBlack">/</span>Ps',
  'B/W': '<span class="manaBlack">O</span><span class="manaWhite">/</span>Sp',
  'U/B': '<span class="manaBlue">O</span><span class="manaBlack">/</span>Is',
  'B/U': '<span class="manaBlack">O</span><span class="manaBlue">/</span>Si',
  'R/W': '<span class="manaRed">O</span><span class="manaWhite">/</span>Mp',
  'W/R': '<span class="manaWhite">O</span><span class="manaRed">/</span>Pm',
  'R/U': '<span class="manaRed">O</span><span class="manaBlue">/</span>Mi',
  'U/R': '<span class="manaBlue">O</span><span class="manaRed">/</span>Im',
  'R/B': '<span class="manaRed">O</span><span class="manaBlack">/</span>Ms',
  'B/R': '<span class="manaBlack">O</span><span class="manaRed">/</span>Sm',
  'U/G': '<span class="manaBlue">O</span><span class="manaGreen">/</span>If',
  'G/U': '<span class="manaGreen">O</span><span class="manaBlue">/</span>Fi',
  'G/W': '<span class="manaGreen">O</span><span class="manaWhite">/</span>Fp',
  'W/G': '<span class="manaWhite">O</span><span class="manaGreen">/</span>Pf',
  'G/B': '<span class="manaGreen">O</span><span class="manaBlack">/</span>Fs',
  'B/G': '<span class="manaBlack">O</span><span class="manaGreen">/</span>Sf',
  'G/R': '<span class="manaGreen">O</span><span class="manaRed">/</span>Fm',
  'R/G': '<span class="manaRed">O</span><span class="manaGreen">/</span>Mf',

  // Phyrexian Hybrid
  'W/U/P': '<span class="manaWhite">O</span><span class="manaBlue">/</span>Z',
  'U/W/P': '<span class="manaBlue">O</span><span class="manaWhite">/</span>Z',
  'W/B/P': '<span class="manaWhite">O</span><span class="manaBlack">/</span>Z',
  'B/W/P': '<span class="manaBlack">O</span><span class="manaWhite">/</span>Z',
  'U/B/P': '<span class="manaBlue">O</span><span class="manaBlack">/</span>Z',
  'B/U/P': '<span class="manaBlack">O</span><span class="manaBlue">/</span>Z',
  'R/W/P': '<span class="manaRed">O</span><span class="manaWhite">/</span>Z',
  'W/R/P': '<span class="manaWhite">O</span><span class="manaRed">/</span>Z',
  'R/U/P': '<span class="manaRed">O</span><span class="manaBlue">/</span>Z',
  'U/R/P': '<span class="manaBlue">O</span><span class="manaRed">/</span>Z',
  'R/B/P': '<span class="manaRed">O</span><span class="manaBlack">/</span>Z',
  'B/R/P': '<span class="manaBlack">O</span><span class="manaRed">/</span>Z',
  'U/G/P': '<span class="manaBlue">O</span><span class="manaGreen">/</span>Z',
  'G/U/P': '<span class="manaGreen">O</span><span class="manaBlue">/</span>Z',
  'G/W/P': '<span class="manaGreen">O</span><span class="manaWhite">/</span>Z',
  'W/G/P': '<span class="manaWhite">O</span><span class="manaGreen">/</span>Z',
  'G/B/P': '<span class="manaGreen">O</span><span class="manaBlack">/</span>Z',
  'B/G/P': '<span class="manaBlack">O</span><span class="manaGreen">/</span>Z',
  'G/R/P': '<span class="manaGreen">O</span><span class="manaRed">/</span>Z',
  'R/G/P': '<span class="manaRed">O</span><span class="manaGreen">/</span>Z',

  // Two-brid
  '2/W': '<span class="manaGeneric">O</span><span class="manaWhite">/</span>WR',
  '2/U': '<span class="manaGeneric">O</span><span class="manaBlue">/</span>WS',
  '2/B': '<span class="manaGeneric">O</span><span class="manaBlack">/</span>WT',
  '2/R': '<span class="manaGeneric">O</span><span class="manaRed">/</span>WU',
  '2/G': '<span class="manaGeneric">O</span><span class="manaGreen">/</span>WV',

  // Colorless-brid
  'C/W': '<span class="manaGeneric">O</span><span class="manaWhite">/</span>[R',
  'C/U': '<span class="manaGeneric">O</span><span class="manaBlue">/</span>[S',
  'C/B': '<span class="manaGeneric">O</span><span class="manaBlack">/</span>[T',
  'C/R': '<span class="manaGeneric">O</span><span class="manaRed">/</span>[U',
  'C/G': '<span class="manaGeneric">O</span><span class="manaGreen">/</span>[V',

  // No clue
  'W/p': '<span class="manaGeneric">O</span><span class="manaWhite">/</span>Ls',
  'U/p': '<span class="manaGeneric">O</span><span class="manaBlue">/</span>Ms',
  'B/p': '<span class="manaGeneric">O</span><span class="manaBlack">/</span>Ns',
  'R/p': '<span class="manaGeneric">O</span><span class="manaRed">/</span>Os',
  'G/p': '<span class="manaGeneric">O</span><span class="manaGreen">/</span>Ps',

  // Phyrexian Mana
  'W/P': '<span class="manaWhitePhy">O</span>Z',
  'U/P': '<span class="manaBluePhy">O</span>Z',
  'B/P': '<span class="manaBlackPhy">O</span>Z',
  'R/P': '<span class="manaRedPhy">O</span>Z',
  'G/P': '<span class="manaGreenPhy">O</span>Z',

  '10': '<span class="manaGeneric">o</span>º',
  '11': '<span class="manaGeneric">o</span>»',
  '12': '<span class="manaGeneric">o</span>¼',
  '13': '<span class="manaGeneric">o</span>½',
  '14': '<span class="manaGeneric">o</span>¾',
  '15': '<span class="manaGeneric">o</span>¿',
  '16': '<span class="manaGeneric">o</span>À',
  '17': '<span class="manaGeneric">o</span>Á',
  '18': '<span class="manaGeneric">o</span>Â',
  '19': '<span class="manaGeneric">o</span>Ã',
  '20': '<span class="manaGeneric">o</span>Ä',
  'X': '<span class="manaGeneric">o</span>X',
}
export const tombstoneList = [`A Good Day to Pie`,`Abandon the Post`,`Acorn Harvest`,`Advanced Stitchwing`,`Akoum Firebird`,`Akuta, Born of Ash`,`Altar of the Wretched // Wretched Bonemass`,`Alter Reality`,`Amphin Mutineer`,`Anathemancer`,`Ancestral Tribute`,`Ancient Grudge`,`Angel of Grace`,`Angel of Sanctions`,`Angelfire Ignition`,`Anger`,`Anointer Priest`,`Appeal // Authority`,`Arcane Infusion`,`Archfiend of Sorrows`,`Arclight Phoenix`,`Arden Angel`,`Army of the Damned`,`Artful Dodge`,`Artificer's Dragon`,`Arvad, Weatherlight Smuggler`,`Ashen Ghoul`,`Ashnod's Harvester`,`Assemble from Parts`,`Auntie's Snitch`,`Aurora Eidolon`,`Aurora Phoenix`,`Aven Initiate`,`Aven Wind Guide`,`Baithook Angler // Hook-Haunt Drifter`,`Bannerhide Krushok`,`Bash to Bits`,`Battle Screech`,`Beacon Bolt`,`Beast Attack`,`Beloved Beggar // Generous Soul`,`Benalish Partisan`,`Bestial Bloodline`,`Binding Geist // Spectral Binding`,`Bladewing's Thrall`,`Blast from the Past`,`Blood Operative`,`Blood Speaker`,`Bloodfeather Phoenix`,`Bloodghast`,`Bloodsoaked Champion`,`Bone Dragon`,`Boneyard Mycodrax`,`Boneyard Scourge`,`Bookwurm`,`Brackish Trudge`,`Brackwater Elemental`,`Bramble Wurm`,`Brawn`,`Briarblade Adept`,`Bridge from Below`,`Brine Comber // Brinebound Gift`,`Bump in the Night`,`Buried Treasure`,`Burning Oil`,`Cabal Therapy`,`Cackling Counterpart`,`Calibrated Blast`,`Call of the Herd`,`Call the Skybreaker`,`Can't Stay Away`,`Canoptek Tomb Sentinel`,`Canopy Claws`,`Cardpecker`,`Carrionette`,`Cauldron Familiar`,`Cenn's Enlistment`,`Centaur Vinecrasher`,`Chainer's Edict`,`Chamber Sentry`,`Champion of Stray Souls`,`Chandra's Phoenix`,`Chaplain of Alms // Chapel Shieldgeist`,`Chatter of the Squirrel`,`Chemister's Insight`,`Chill of Foreboding`,`Chronomancer`,`Chronosavant`,`Cityscape Leveler`,`Claim // Fame`,`Clattering Augur`,`Clay Revenant`,`Cleaving Reaper`,`Coastline Marauders`,`Cobbled Lancer`,`Coffin Puppets`,`Coffin Purge`,`Combat Courier`,`Commit // Memory`,`Conflagrate`,`Consign // Oblivion`,`Controvert`,`Convenient Target`,`Corpse Cobble`,`Corpse Connoisseur`,`Council's Deliberation`,`Covert Cutpurse // Covetous Geist`,`Covetous Castaway // Ghostly Castigator`,`Craving of Yeenoghu`,`Crawl from the Cellar`,`Creature Guy`,`Creeping Renaissance`,`Crippling Fatigue`,`Critical Hit`,`Croaking Counterpart`,`Crown of Skemfar`,`Crush of Wurms`,`Cult Conscript`,`Curious Cadaver`,`Cut // Ribbons`,`Daring Fiendbonder`,`Dark Intimations`,`Dauntless Cathar`,`Deadbridge Goliath`,`Deadhead`,`Deadly Allure`,`Deal Damage`,`Dearly Departed`,`Death of a Thousand Stings`,`Death Spark`,`Death Tyrant`,`Deathless Ancient`,`Deathless Behemoth`,`Deathless Knight`,`Deathmist Raptor`,`Decaying Time Loop`,`Deep Analysis`,`Deep Reconnaissance`,`Defy Gravity`,`Dematerialize`,`Demilich`,`Dennick, Pious Apprentice // Dennick, Pious Apparition`,`Desperate Ravings`,`Despoiler of Souls`,`Destined // Lead`,`Devil's Play`,`Devoted Grafkeeper // Departed Soulkeeper`,`Dihada's Ploy`,`Diligent Farmhand`,`Diminished Returner`,`Dire-Strain Rampage`,`Direct Current`,`Diregraf Rebirth`,`Distracting Geist // Clever Distraction`,`Divine Reckoning`,`Dodgy Jalopy`,`Dorothea, Vengeful Victim // Dorothea's Retribution`,`Dragon Breath`,`Dragon Fangs`,`Dragon Scales`,`Dragon Shadow`,`Dragon Wings`,`Dread Return`,`Dread Wanderer`,`Dream Twist`,`Dreamstealer`,`Dreg Mangler`,`Dregscape Sliver`,`Dregscape Zombie`,`Driven // Despair`,`Drogskol Infantry // Drogskol Armaments`,`Drownyard Temple`,`Drudge Beetle`,`Dryad's Revival`,`Dungeon Crawler`,`Durable Coilbug`,`Dusk // Dawn`,`Dutiful Griffin`,`Earth Rift`,`Earthquake Dragon`,`Echo of Eons`,`Eelectrocute`,`Eerie Soultender`,`Electric Revelation`,`Elephant Ambush`,`Elvish Dreadlord`,`Embolden`,`Engulfing Flames`,`Enigma Eidolon`,`Entropic Eidolon`,`Erebos's Titan`,`Eternal Dragon`,`Etherium Abomination`,`Evershrike`,`Exile into Darkness`,`Expendable Lackey`,`Exquisite Huntmaster`,`Extractor Demon`,`Faerie Dreamthief`,`Failure // Comply`,`Fairgrounds Patrol`,`Faithbound Judge // Sinner's Judgment`,`Faithful Mending`,`Faithless Looting`,`Falkenrath Forebear`,`Farm // Market`,`Fatestitcher`,`Fathom Fleet Swordjack`,`Feasting Troll King`,`Feeling of Dread`,`Fervent Denial`,`Filth`,`Fin-Clade Fugitives`,`Fire-Field Ogre`,`Firebolt`,`Firecat Blitz`,`Firemane Angel`,`Fires of Undeath`,`Firewing Phoenix`,`First-Sphere Gargantua`,`Flame Jab`,`Flamewake Phoenix`,`Flaming Gambit`,`Flaring Pain`,`Flash of Defiance`,`Flash of Insight`,`Fleshless Gladiator`,`Folk Medicine`,`For the Ancestors`,`Forbidden Alchemy`,`From the Catacombs`,`Galedrifter // Waildrifter`,`Galvanic Iteration`,`Gangrenous Goliath`,`Garza's Assassin`,`Gate Colossus`,`Gaze of Justice`,`Geistblast`,`Geistflame`,`Genesis`,`Geralf's Masterpiece`,`Ghastly Remains`,`Ghost Ark`,`Ghoulcaller's Accomplice`,`Ghoulcaller's Harvest`,`Ghoulsteed`,`Gigapede`,`Gilded Assault Cart`,`Gixian Recycler`,`Glamerdye`,`Glory`,`Glyph Keeper`,`Gnaw to the Bone`,`Golgari Brownscale`,`Golgari Decoy`,`Gollum, Patient Plotter`,`Gollum's Bite`,`Grafted Butcher`,`Grasp of Phantoms`,`Gravestone Strider`,`Gravitic Punch`,`Grim Harvest`,`Grim Reminder`,`Grind // Dust`,`Grixis Slavedriver`,`Grizzly Fate`,`Gryff's Boon`,`Gutter Skulker // Gutter Shortcut`,`Gutterbones`,`Hallowed Respite`,`Halo Scarab`,`Hammer of Bogardan`,`Haunt of the Dead Marshes`,`Haunted Dead`,`Heart-Piercer Manticore`,`Heaven // Earth`,`Heavyweight Demolisher`,`Helbrute`,`Hell's Thunder`,`Hellspark Elemental`,`Heron-Blessed Geist`,`Hexmark Destroyer`,`Hollowhenge Wrangler`,`Homestead Courage`,`Honored Hydra`,`Hormagaunt Horde`,`Howling Gale`,`Hungry for More`,`Icefall`,`Ichor Aberration`,`Ichor Drinker`,`Ichorid`,`Ignite the Future`,`Illustrious Historian`,`Impulsive Pilferer`,`Increasing Ambition`,`Increasing Confusion`,`Increasing Devotion`,`Increasing Savagery`,`Increasing Vengeance`,`Indulge // Excess`,`Insult // Injury`,`Isengard Unleashed`,`Jack-o'-Lantern`,`Jarad, Golgari Lich Lord`,`Jaya's Phoenix`,`Join the Dance`,`Jungle Creeper`,`Kaleidoscorch`,`Kami of Transience`,`Kangee's Lieutenant`,`Karlach, Raging Tiefling`,`Kathari Bomber`,`Kathari Screecher`,`Katilda, Dawnhart Martyr // Katilda's Rising Dawn`,`Kederekt Leviathan`,`Kill! Destroy!`,`Kindly Ancestor // Ancestor's Embrace`,`Kinsbaile Courier`,`Kitesail Skirmisher`,`Korozda Monitor`,`Kozilek's Return`,`Kraul Swarm`,`Krosan Reclamation`,`Krovikan Horror`,`Krovikan Rot`,`Kuldotha Phoenix`,`Labyrinth Guardian`,`Lantern Bearer // Lanterns' Lift`,`Laughing Hyena`,`Lava Dart`,`Leave // Chance`,`Leering Onlooker`,`Lifetime Pass Holder`,`Light Up the Night`,`Lightning Phoenix`,`Lightning Surge`,`Lingering Phantom`,`Lingering Souls`,`Llanowar Greenwidow`,`Loathsome Troll`,`Lochmere Serpent`,`Lokhust Heavy Destroyer`,`Lunar Hatchling`,`Lunarch Veteran // Luminous Phantom`,`Maestros Initiate`,`Magma Phoenix`,`Malevolent Hermit // Benevolent Geist`,`Managorger Phoenix`,`Marshaling Cry`,`Mask of the Jadecrafter`,`Masked Admirers`,`Mass Diminish`,`Master of Death`,`Maximize Altitude`,`Maximize Velocity`,`Me, the Immortal`,`Memory Deluge`,`Memory's Journey`,`Merfolk Pupil`,`Metalwork Colossus`,`Mirrorhall Mimic // Ghastly Mimicry`,`Mischievous Catgeist // Catlike Curiosity`,`Mishra's Juggernaut`,`Mishra's Research Desk`,`Mist Dancer`,`Moan of the Unhallowed`,`Moment's Peace`,`Momentary Blink`,`Monstrify`,`Morbid Hunger`,`Morgue Theft`,`Moss-Pit Skeleton`,`Mosswood Dreadknight // Dread Whispers`,`Mother Bear`,`Mourning Patrol // Morning Apparition`,`Mouth // Feed`,`Multani, Yavimaya's Avatar`,`Mystic Retrieval`,`Mystical Teachings`,`Naktamun`,`Narfi, Betrayer King`,`Nearheath Chaplain`,`Necrosavant`,`Nemesis Phoenix`,`Nephalia Moondrakes`,`Nether Shadow`,`Nether Spirit`,`Nether Traitor`,`Nettling Host`,`Never // Return`,`Nightbird's Clutches`,`Nim Devourer`,`Number Crunch`,`Oketra's Attendant`,`Old One Eye`,`Onakke Oathkeeper`,`Onward // Victory`,`Oona's Grace`,`Otharri, Suns' Glory`,`Otherworldly Gaze`,`Ovalchase Daredevil`,`Overwhelmed Archivist // Archive Haunt`,`Parallel Evolution`,`Pardic Firecat`,`Past in Flames`,`Patchplate Resolute`,`Path to the Festival`,`Perennial Behemoth`,`Persistent Specimen`,`Phantasmagorian`,`Phoenix Chick`,`Phyrexian Dragon Engine`,`Phyrexian Triniform`,`Pilgrim of the Ages`,`Placid Rottentail`,`Platoon Dispenser`,`Poxwalkers`,`Prepare // Fight`,`Priest of Fell Rites`,`Prismatic Strands`,`Prisoner's Dilemma`,`Prized Amalgam`,`Punishing Fire`,`Purify the Grave`,`Pyre Zombie`,`Pyrewild Shaman`,`Quakebringer`,`Quasiduplicate`,`Radical Idea`,`Raffine's Guidance`,`Rags // Riches`,`Rakshasa Debaser`,`Rally the Peasants`,`Raven's Crime`,`Ray of Distortion`,`Ray of Revelation`,`Razorlash Transmogrant`,`Reach of Branches`,`Reality Scramble`,`Reap the Seagraf`,`Reason // Believe`,`Reassembling Skeleton`,`Reckless Charge`,`Reconstructed Thopter`,`Recoup`,`Redtooth Vanguard`,`Reduce // Rubble`,`Refuse // Cooperate`,`Rekindled Flame`,`Repeating Barrage`,`Resize`,`Retriever Phoenix`,`Riftstone Portal`,`Ringwraiths`,`Rise of the Ants`,`Risk Factor`,`Rite of Harmony`,`Rite of Oblivion`,`Road // Ruin`,`Roar of the Wurm`,`Rolling Temblor`,`Rona, Sheoldred's Faithful`,`Rot Farm Skeleton`,`Rotten Reunion`,`Rotting Rats`,`Royal Warden`,`Rubblebelt Maverick`,`Run for Your Life`,`Runehorn Hellkite`,`Sacred Fire`,`Salvage Titan`,`Sandstorm Eidolon`,`Sanitarium Skeleton`,`Savage Conception`,`Save Life`,`Saving Grasp`,`Scavenged Brawler`,`Scorching Missile`,`Scour All Possibilities`,`Scourge Devil`,`Scrapheap Scrounger`,`Scrapwork Cohort`,`Scrapwork Mutt`,`Scrapwork Rager`,`Screaming Swarm`,`Seasoned Pyromancer`,`Secrets of the Key`,`Sedraxis Specter`,`Seize the Day`,`Seize the Storm`,`Sekki, Seasons' Guide`,`Self-Reflection`,`Sever the Bloodline`,`Sevinne's Reclamation`,`Sewer Shambler`,`Shadowbeast Sighting`,`Shambling Remains`,`Shard Phoenix`,`Shattered Perception`,`Shellephant`,`Silent Departure`,`Silversmote Ghoul`,`Simian Simulacrum`,`Siphon Insight`,`Skarrgan Firebird`,`Skeleton Crew`,`Skorpekh Lord`,`Skull Fracture`,`Skyblade's Boon`,`Skyclave Shade`,`Skyfire Phoenix`,`Slimefoot and Squee`,`Slitherhead`,`Sliver Gravemother`,`Sluiceway Scorpion`,`Smiting Helix`,`Smoke Shroud`,`Solemn Doomguide`,`Sonic Assault`,`Sosuke's Summons`,`Soul of Eternity`,`Soul of Innistrad`,`Soul of New Phyrexia`,`Soul of Ravnica`,`Soul of Shandalar`,`Soul of Theros`,`Soul of Zendikar`,`Spectral Steel`,`Spell Counter`,`Spellbinding Soprano`,`Spellpyre Phoenix`,`Spider Spawning`,`Spirit Flare`,`Spit Flame`,`Spitting Image`,`Spring // Mind`,`Squee, Dubious Monarch`,`Squee, Goblin Nabob`,`Squee, the Immortal`,`Start // Finish`,`Start the TARDIS`,`Startled Awake // Persistent Nightmare`,`Stitchwing Skaab`,`Stop That`,`Storm the Festival`,`Strangling Soot`,`Strike It Rich`,`Struggle // Survive`,`Summon the School`,`Sun's Bounty`,`Sunstreak Phoenix`,`Suspicious Shambler`,`Sword of the Meek`,`Sylvan Might`,`Syphon Life`,`Talons of Wildwood`,`Tapping at the Window`,`Tenacious Underdog`,`Terisian Mindbreaker`,`Terror Ballista`,`Terrus Wurm`,`The Cinematic Phoenix`,`The Indomitable`,`The Sound of Drums`,`Their Number Is Legion`,`Think Twice`,`Third Little Pig`,`Thrashing Mossdog`,`Thrill of the Hunt`,`Throes of Chaos`,`Thunderblade Charge`,`Timeless Dragon`,`Tocasia's Onulet`,`Tomakul Phoenix`,`Tomb Blade`,`Touch and Go`,`Tracker's Instincts`,`Traitor's Clutch`,`Travel Preparations`,`Triarch Praetorian`,`Trove Tracker`,`Trustworthy Scout`,`Turn the Earth`,`Twinblade Geist // Twinblade Invocation`,`Tymaret, the Murder King`,`Uchbenbak, the Great Mistake`,`Unburial Rites`,`Unconventional Tactics`,`Undead Gladiator`,`Undead Leotau`,`Unlawful Entry`,`Unnatural Moonrise`,`Unshakable Tail`,`Unwilling Ingredient`,`Valiant Veteran`,`Valor`,`Veilborn Ghoul`,`Vengeful Pharaoh`,`Vengevine`,`Verdant Eidolon`,`Vineweft`,`Viral Spawning`,`Viscera Dragger`,`Visions of Dominance`,`Visions of Dread`,`Visions of Duplicity`,`Visions of Glory`,`Visions of Ruin`,`Vithian Stinger`,`Vivien's Jaguar`,`Vladimir and Godfrey`,`Voidwing Hybrid`,`Volcanic Spray`,`Volley of Boulders`,`Wake to Slaughter`,`Warcry Phoenix`,`Waves of Aggression`,`Whiteout`,`Wild Hunger`,`Wilson, Ardent Bear`,`Wilson, Fearsome Bear`,`Wilson, Majestic Bear`,`Wilson, Subtle Bear`,`Wilson, Urbane Bear`,`Winterthorn Blessing`,`Wire Surgeons`,`Wonder`,`World Breaker`,`Worm Harvest`,`Wreck and Rebuild`,`Wurmquake`,`Yotian Frontliner`,`Zanikev Locust`,`Zask, Skittering Swarmlord`,`Zombified`];
