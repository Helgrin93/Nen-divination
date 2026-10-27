import { defineConfig } from 'vite';
import { readFile, readdir } from 'node:fs/promises';

// Private reference crops remain local; runtime scene assets ship in every build.
function localScenePreview(mode) {
  const names = ['wing-room.png', 'table-glass.png', 'room-edge.png', 'table-edge.png', 'anime-water-scene.png'];
  // Always use the canonical rounded, stemmed glass reference in every phase.
  // A stale preview extraction must not replace its silhouette.
  const sceneSource = name => new URL(name === 'anime-water-scene.png'
    ? './reference/ANIME_HANDS_GLASS_REFERENCE.png'
    : `./.verification/v2/scene/${name}`, import.meta.url);
  return {
    name: 'local-scene-preview',
    configureServer(server) {
      server.middlewares.use('/__character-preview', async (req, res, next) => {
        const name = req.url.split('?')[0].replace(/^\//, '');
        if (!/^[a-z]+\.jpg$/.test(name)) return next();
        try {
          res.setHeader('Content-Type', 'image/jpeg');
          res.end(await readFile(new URL(`./.verification/v2/characters/${name}`, import.meta.url)));
        } catch { res.statusCode = 404; res.end('Portrait unavailable'); }
      });
      server.middlewares.use('/__scene-preview', async (req, res, next) => {
        const name = req.url.split('?')[0].replace(/^\//, '');
        if (!names.includes(name)) return next();
        try {
          const bytes = await readFile(sceneSource(name));
          res.setHeader('Content-Type', 'image/png');
          res.end(bytes);
        } catch { res.statusCode = 404; res.end('Local scene asset missing'); }
      });
    },
    async generateBundle() {
      // Only the runtime composition and poses are published, never source files.
      const sceneAssets=new Set(['unified-goblet-scene.png','wing-neutral.png','wing-smile.png','wing-eyes-closed.png','wing-gesture.png']);
      const copyPublic=async(directory,prefix='')=>{
        for(const entry of await readdir(directory,{withFileTypes:true})){
          if(entry.name.startsWith('.'))continue;
          const fileName=prefix+entry.name;
          const source=new URL(entry.name+(entry.isDirectory()?'/':''),directory);
          if(entry.isDirectory())await copyPublic(source,fileName+'/');
          else if(!fileName.startsWith('assets/scene-v3/') || sceneAssets.has(entry.name)){
            this.emitFile({type:'asset',fileName,source:await readFile(source)});
          }
        }
      };
      await copyPublic(new URL('./public/',import.meta.url));
      if (mode !== 'local-review') return;
      for (const name of names) this.emitFile({ type: 'asset', fileName: `__scene-preview/${name}`, source: await readFile(sceneSource(name)) });
      const manifest=JSON.parse(await readFile(new URL('./src/data/characterImages.json', import.meta.url),'utf8'));
      for(const entry of Object.values(manifest.characters || {})){
        const name=entry.localPreviewSrc?.match(/^__character-preview\/([a-z]+\.jpg)$/)?.[1];
        if(name)this.emitFile({type:'asset',fileName:`__character-preview/${name}`,source:await readFile(new URL(`./.verification/v2/characters/${name}`,import.meta.url))});
      }
    },
  };
}

export default defineConfig(({ command, mode }) => ({
  plugins: [localScenePreview(mode)],
  base: command === 'build' ? '/nen-divination/' : '/',
  build: { copyPublicDir: false },
  server: { watch: { ignored: ['**/.verification/**', '**/test-results/**', '**/playwright-report/**'] } },
  test: { include: ['src/tests/**/*.test.js'] },
}));
