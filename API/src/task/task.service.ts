import * as moment from 'moment';

export class TaskService {
  constructor() { }


  createMultipleRandomTasks(): any[] {
    const tasks: any[] = [];
    for (let i = 0; i < 500000; i++) {
      const rand: any[] = this.randomName();
      tasks.push({
        index: i,
        name: rand[0],
        userId: rand[1],
        mobile: rand[2],
        mobileNormalized: rand[2].toString(), // Use this field for searching purpose
        taskDate: this.randomDate(new Date(1900, 0, 1), new Date()),
      });
    }
    return tasks;
  }

  randomName() {
    const i = Math.floor(Math.random() * this.adjectives.length);
    const j = Math.floor(Math.random() * this.nouns.length);
    return [`${this.adjectives[i]} ${this.nouns[j]}`, `${this.adjectives[i]}.${this.nouns[j]}@gmail.com`, this.randomNumber()];
  }

  randomNumber() {
    return Math.floor(Math.random() * 9000000000) + 1000000000;
  }

  randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }


  private adjectives: string[] = ['adamant', 'adroit',
    'amatory', 'animistic', 'antic', 'arcadian', 'baleful', 'bellicose', 'bilious', 'boorish',
    'calamitous', 'caustic', 'cerulean', 'comely', 'concomitant', 'contumacious', 'corpulent', 'crapulous',
    'defamatory', 'didactic', 'dilatory', 'dowdy', 'efficacious', 'effulgent', 'egregious', 'endemic', 'equanimous',
    'execrable', 'fastidious', 'feckless', 'fecund', 'friable', 'fulsome', 'garrulous', 'guileless', 'gustatory',
    'heuristic', 'histrionic', 'hubristic', 'incendiary', 'insidious', 'insolent', 'intransigent', 'inveterate',
    'invidious', 'irksome', 'jejune', 'jocular', 'judicious', 'lachrymose', 'limpid', 'loquacious', 'luminous',
    'mannered', 'mendacious', 'meretricious', 'minatory', 'mordant', 'munificent', 'nefarious', 'noxious', 'obtuse',
    'parsimonious', 'pendulous', 'pernicious', 'pervasive', 'petulant', 'platitudinous', 'precipitate', 'propitious',
    'puckish', 'querulous', 'quiescent', 'rebarbative', 'recalcitant', 'redolent', 'rhadamanthine', 'risible',
    'ruminative', 'sagacious', 'salubrious', 'sartorial', 'sclerotic', 'serpentine', 'spasmodic', 'strident',
    'taciturn', 'tenacious', 'tremulous', 'trenchant', 'turbulent', 'turgid', 'ubiquitous', 'uxorious', 'verdant',
    'voluble', 'voracious', 'wheedling', 'withering', 'zealous'];
  private nouns: string[] = ['ninja', 'chair', 'pancake', 'statue', 'unicorn', 'rainbows', 'laser', 'senor', 'bunny', 'captain',
    'nibblets', 'cupcake', 'carrot', 'gnomes', 'glitter', 'potato', 'salad', 'toejam', 'curtains', 'beets', 'toilet',
    'exorcism', 'stick figures', 'mermaid eggs', 'sea barnacles', 'dragons', 'jellybeans', 'snakes', 'dolls', 'bushes',
    'cookies', 'apples', 'ice cream', 'ukulele', 'kazoo', 'banjo', 'opera singer', 'circus', 'trampoline', 'carousel',
    'carnival', 'locomotive', 'hot air balloon', 'praying mantis', 'animator', 'artisan', 'artist', 'colorist', 'inker',
    'coppersmith', 'director', 'designer', 'flatter', 'stylist', 'leadman', 'limner', 'make-up artist', 'model', 'musician',
    'penciller', 'producer', 'scenographer', 'set decorator', 'silversmith', 'teacher', 'auto mechanic', 'beader', 'bobbin boy',
    'clerk of the chapel', 'fil'];

}
