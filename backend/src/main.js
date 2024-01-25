const path = require('path');
const Hapi = require('hapi');
const fs = require('fs');
const https = require('https');

// ---
// Config
// ---

// Define the directory that the frontend builds to. Note that this is
// only used when starting the backend server on its own. When accessed
// from the dev server, the backend only ever receives routes that
// begin with `/api/`.
const frontendFolder = path.resolve(__dirname, '../../frontend/dist')

// Check if the `frontendFolder` is missing
const frontendFolderIsMissing = !fs.existsSync(frontendFolder)

// If the `frontendFolder` is missing...
if (frontendFolderIsMissing) {
  // If the `frontendFolder` is missing in production...
  if (process.env.NODE_ENV === 'production') {
    // Display an error letting the user know what they should do.
    console.error(
      'Directory `frontend/dist` does not exist. You must run `yarn build` before starting the app in production.'
    )
    // Abort starting up the app.
    process.exit(1)
  }
  // Or, if the `frontendFolder` is missing another environment...
  else {
    // Create the `frontendFolder` to avoid errors in development.
    fs.mkdirSync(frontendFolder)
  }
}

// Create the server with Hapi: https://hapijs.com/
const server = new Hapi.Server({
  // This is needed by some hosts, like Heroku.
  host: '0.0.0.0',
  // Set to port to the `PORT` environment variable, or to `9090`.
  port: process.env.PORT || 9090,
  routes: {
    // Allow cross-origin requests.
    cors: true,
    files: {
      // Treat `frontendFolder` as the public folder.
      relativeTo: frontendFolder,
    },
  },
})

// ---
// Plugin registration
// ---

// Allow serving files.
const plugins = [require('inert')]

// Ensure SSL in production.
if (process.env.NODE_ENV === 'production') {
  plugins.push(require('hapi-require-https'))
}

// ---
// Error Handling
// ---

// Allow errors from unhandled promise rejections to be logged
// and make sure they crash the server to avoid going unnoticed.
process.on('unhandledRejection', error => {
  console.error(error)
  process.exit(1)
})

server.register(plugins).then(() => {
  // --------------
  // Authentication
  // --------------

  // This is where you can set up authentication for your app,
  // for example using: https://github.com/dwyl/hapi-auth-jwt2

  // ----------
  // API routes
  // ----------

  let cache = {};

  // Helper to create API routes. All routes handled by the
  // backend should use this helper.

  async function createApiRoute(path, options) {
    server.route({
      path: `/api/${path}`,
      method: 'POST',
      handler: async (request, h) => {
        const payload = request.payload; // Access the payload from the request
        console.log(payload);
        const results = {};
        let cardData = [];
  
        async function fetchPage(url) {
          const pageUrl = new URL(url); // Parse the next_page URL
  
          const pageOptions = {
            hostname: pageUrl.hostname,
            path: pageUrl.pathname + pageUrl.search, // Use the path and query from the URL
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'GET', // Use GET method
          };
  
          return new Promise((resolve, reject) => {
            const proxyRequest = https.request(pageOptions, (proxyResponse) => {
              let data = '';
  
              proxyResponse.on('data', (chunk) => {
                data += chunk;
              });
  
              proxyResponse.on('end', () => {
                const responseData = JSON.parse(data);
                if(responseData?.data) cardData.push(...responseData.data);
                resolve(); // Resolve the promise when the fetch operation is complete
              });
            });
  
            proxyRequest.on('error', (error) => {
              console.error('Error proxying request to 3rd party API:', error);
              reject(new Error('Error proxying request to 3rd party API')); // Reject the promise with an error
            });
  
            proxyRequest.end();
          });
        }
  
        // Use Promise.all with an array to store the fetched data in the correct order
        await Promise.all(payload.cardList.map(async (cardName, index) => {
          cardData = [];
          if (!cache[cardName.toLowerCase()] || (new Date().getTime() - (cache[cardName.toLowerCase()]?.time.getTime() || 0) > 24 * 60 * 60 * 1000)) {
            const initialPageUrl = `https://api.scryfall.com/cards/search?order=released&dir=asc&unique=art&q=name%3D${encodeURIComponent(`"${cardName}"`)}`;
            const fetchedData = await fetchPage(initialPageUrl, index); // Start fetching the initial page for each item
            cache[cardName.toLowerCase()] = {
              time: new Date(),
              data: findFirstPrinting(cardName,cardData),
            };
          }
          results[cardName] = cache[cardName.toLowerCase()].data || {};
        }));

        let orderedResults = {};
        payload.cardList.forEach(cardName => {
          orderedResults[cache[cardName.toLowerCase()].data?.name || cardName] = results[cardName];
        });

        return h.response(orderedResults); // Return the aggregated results in the same order as the request
      },
      options: {
        ...options
      }
    });
  }

  function findFirstPrinting(cardName,cardData){
    return cardData.find(card => card.name.toLowerCase() === cardName.toLowerCase() && card.reprint === false);
  }
  
  // Create an example route for `/api/cards`.
  createApiRoute('cards', {});

  // ----------
  // SPA routes
  // ----------
  // Redirect all unmatched routes to the frontend

  // For each file or folder in `frontendFolder`...
  fs.readdirSync(frontendFolder).forEach(fileOrFolder => {
    // Check if it's a folder
    const isFolder = fs.statSync(frontendFolder, fileOrFolder).isDirectory()

    // If a folder...
    if (isFolder) {
      // Forward routes to assets folders.
      server.route({
        method: 'GET',
        path: `/${fileOrFolder}/{file*}`,
        config: {
          auth: false,
          handler: {
            directory: {
              path: `./${fileOrFolder}`,
            },
          },
        },
      })
    }
    // Or, if a file not named `index.html`...
    else if (fileOrFolder !== 'index.html') {
      // Forward routes to top-level files.
      server.route({
        method: 'GET',
        path: `/${fileOrFolder}`,
        config: {
          auth: false,
          handler: {
            file: fileOrFolder,
          },
        },
      })
    }
  })

  // Forward all unregistered routes to `index.html`, so that
  // the frontend handles everything not defined by the backend,
  // including 404s.
  server.route({
    method: '*',
    path: '/{route*}',
    config: {
      auth: false,
      handler: {
        file: 'index.html',
      },
    },
  })

  // -----
  // Start the server
  // -----

  return server.start().then(() => {
    console.info(`Started backend at ${server.info.uri}`)
  })
})
