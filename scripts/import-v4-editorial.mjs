// One-time, reproducible import of the owner's approved Italian copy. No scoring changes.
import { readFile, writeFile } from 'node:fs/promises';
const spec = await readFile('NEN_DIVINATION_V4_CODEX/NEN_DIVINATION_FINAL_POLISH_V4.md', 'utf8');
const groups = ['enhancement', 'emission', 'transmutation', 'conjuration', 'manipulation', 'specialization'];
const slugs = ['gon','netero','uvogin','phinks','palm','meruem','zeno','razor','leorio','knov','killua','hisoka','biscuit','machi','feitan','kurapika','kite','shizuku','knuckle','genthru','illumi','morel','shalnark','kalluto','shaiapouf','chrollo','neferpitou','pakunoda','neon','meleoron'];
const english = [
  'With Jajanken, he concentrates aura in his fist to deliver devastating blows. The technique also includes ranged attacks and aura blades.',
  'With Hyakushiki Kannon, he summons a gigantic Bodhisattva with many arms, capable of striking at extraordinary speed.',
  'With Big Bang Impact, he concentrates an enormous amount of aura in his fist, unleashing destructive power. He possesses exceptional strength and endurance.',
  'With Ripper Cyclotron, he increases the power of his punches by rotating his arm. Each rotation builds up aura, allowing him to deliver blows of devastating force.',
  'With Black Widow, she uses her hair to create resilient armour, concentrating her aura on attacks. She also possesses Wink Blue, which lets her observe targets from a distance.',
  'Through Aura Synthesis, he increases his aura by consuming other Nen users. After absorbing Pouf and Youpi, he also acquires powers derived from their abilities.',
  'He shapes his aura into a dragon, using it to attack, transport people or unleash a rain of strikes with Dragon Dive.',
  'He concentrates aura into devastatingly powerful spheres. With 14 Devils, he also creates Nen creatures that he can command during combat.',
  'He can project his fist through aura to strike a distant target without physically reaching them. His technique is influenced by his medical knowledge.',
  'With Hide and Seek, he opens portals into a dimension containing numerous rooms, using it to transport people, hide and coordinate strategic operations.',
  'He transforms his aura into electricity, using it to paralyse opponents and enhance his speed and reflexes through Godspeed.',
  'With Bungee Gum, he gives his aura the properties of rubber and gum, using its elasticity and stickiness in combat.',
  'With Magical Esthetician, she summons Cookie, a Nen masseuse who uses special aura lotions to relieve fatigue and accelerate recovery.',
  'She transforms her aura into extremely strong threads, using them to restrain enemies, set traps and stitch wounds, even reattaching body parts.',
  'With Pain Packer, he turns the pain he has suffered into offensive power. The Rising Sun technique creates a scorching sun whose heat increases with his injuries.',
  'He conjures five chains, each with a specific function. When his eyes turn scarlet, he gains access to Specialization and can use Emperor Time.',
  'With Crazy Slots, he conjures different weapons through a random roulette. He cannot choose which weapon he gets, a restriction that increases its power.',
  'She conjures Blinky, a vacuum cleaner capable of sucking up enormous quantities of material, but unable to absorb living beings or objects created with Nen.',
  'With Hakoware, he lends aura to his opponent and accumulates interest through a Nen creature. If the debt exceeds the available aura, the target is forced into Zetsu.',
  'With Countdown, he attaches Nen bombs to targets, which can be activated after specific conditions are met. He also uses Little Flower to cause explosions through contact with his hands.',
  'Through Nen-infused needles, he controls people’s behaviour and movements, turning them into completely obedient puppets.',
  'With Deep Purple, he controls the smoke produced by his pipe, creating soldiers, copies and structures to deceive and trap opponents.',
  'With Black Voice, he controls targets using antennas and a mobile phone. He can also manipulate his own body through an automatic mode.',
  'He manipulates paper fragments through his fan, turning them into cutting weapons. He can also use them to monitor people and listen to distant conversations.',
  'With Spiritual Message, he analyses emotions through his scales, which can also hypnotise. With Beelzebub, he divides his body into numerous controllable copies.',
  'With Skill Hunter, he steals other people’s Nen abilities, keeping them in a book and using them himself after satisfying specific conditions.',
  'With Doctor Blythe, they heal extremely severe wounds, while Terpsichora controls their body like a puppet, making their movements incredibly fast and lethal.',
  'She can read memories through physical contact and, with Memory Bomb, transfer information directly into other people’s minds through Nen bullets.',
  'With Lovely Ghostwriter, she unconsciously writes poems that predict future events. Her prophecies also contain warnings that can help avert misfortune.',
  'With Perfect Plan, he becomes completely imperceptible while holding his breath. Through God’s Accomplice, he can extend this ability to someone he remains in contact with.',
];
const matches = [...spec.matchAll(/^\*\*([^*]+)\*\* — (.+)$/gm)];
if (matches.length !== 30 || english.length !== 30) throw Error('Approved catalog must contain exactly 30 characters.');
const catalog = matches.map((m, i) => ({ name:m[1], slug:slugs[i], nenType:groups[Math.floor(i/5)], portraitSrc:null, permissionStatus:'unverified', nenSource:'NEN_DIVINATION_V4_CODEX/NEN_DIVINATION_FINAL_POLISH_V4.md §2 (editorial mapping; API identifies portraits only)', description:{it:m[2],en:english[i]} }));
await writeFile('src/data/characters.js', `import imageCatalog from './characterImages.json' with { type: 'json' };\n\n// Approved V4 editorial pool: stable order, first three also used in exports.\nexport const characters = ${JSON.stringify(catalog,null,2)}.map(character => ({\n  ...character,\n  image: imageCatalog.characters[character.slug] || { status: 'missing', portraitUrl: null },\n}));\n\nexport const charactersFor = type => characters.filter(character => character.nenType === type);\n`);
console.log('Imported 30 exact Italian descriptions and static English translations.');
