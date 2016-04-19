const Random = require('../shared/Random');

module.exports.get = function () {
  if (Random.bool(0.3)) {
    return simpleNoun();
  } else if (Random.bool(0.5)){
    return pluralNoun();
  } else {
    return singularNoun();
  }
};

function simpleNoun() {
  if (Random.bool(0.5)) {
    return Random.choose(SINGULAR_NOUNS);
  } else {
    return Random.choose(PLURAL_NOUNS);
  }
}

function pluralNoun() {
  return Random.choose(PLURAL_PREFIXES) + ' ' + Random.choose(PLURAL_NOUNS);
}

function singularNoun() {
  return Random.choose(PLURAL_PREFIXES) + ' ' + Random.choose(PLURAL_NOUNS);
}

const EITHER_PREFIXES = [];

const SINGULAR_PREFIXES = [];

const PLURAL_PREFIXES = [
  'Antagonizing',
  'Chinese',
  'Culturally Appropriated',
  'Drastic',
  'Inflatable',
  'Jurassic',
  'Random',
  'Really Bad',
  'The Michael Jordan of',
  'The Very Best',
  'Uncommon',
  'Bad Smelling',
  'Crusty',
  'Military-Grade',
  'Sexy',
  'Cannibalistic',
  'Granite',
  'Jesus\'s',
  'Teenage Mutant',
  'Cancerous',
  'Yo Momma\'s',
  'A Book About',
  'A Documentary On',
  'A Basket Full of',
  'Porn Containing'
];

const PLURAL_NOUNS = [
  'A Cappella',
  'Addendum',
  'Advertisements',
  'Alphabetization',
  'Apathy',
  'Applesauce',
  'Brunettes',
  'Cartography',
  'Chick-fil-a',
  'Clue',
  'College',
  'Comfort Zone',
  'Conversation',
  'Corduroy',
  'Crisp',
  'Criticize',
  'Crumb',
  'Czar',
  'Defect',
  'Dismantlement',
  'Déjà Vu',
  'Ergonomics',
  'Eureka',
  'Everglades',
  'Evolution',
  'Explore',
  'Exponent',
  'Figment',
  'Fishing',
  'Fizz',
  'Flag',
  'Flotsam',
  'Flutter',
  'Gallop',
  'Game Plan',
  'Gratitude',
  'Hang Ten',
  'Ice',
  'Implode',
  'Inquisition',
  'Invitation',
  'Ironic',
  'Jet Lag',
  'Journal',
  'Killer',
  'Kilogram',
  'Landfill',
  'Level',
  'Lifestyle',
  'Ligament',
  'Loiterer',
  'Loyalty',
  'Lyrics',
  'Mascot',
  'Mine Car',
  'Monitor',
  'Mooch',
  'Negotiate',
  'Neutron',
  'Ninja Turtles',
  'Observatory',
  'Oil',
  'Olympia',
  'Opaque',
  'Organize',
  'Overture',
  'Parody',
  'Pastry',
  'Pendulum',
  'Personal Bubble',
  'Philosopher',
  'Pomp',
  'Pomp',
  'Portfolio',
  'Positive',
  'Procrastinate',
  'Protestant',
  'Psychologist',
  'Quarantine',
  'Rainwater',
  'Random',
  'Regret',
  'Retaliate',
  'Roundabout',
  'Sandbox',
  'Satellite',
  'Shaft',
  'Shipwreck',
  'Shrink Ray',
  'Siesta',
  'Silhouette',
  'Slump',
  'Space-time Continuum',
  'Standing Ovation',
  'Stockholder',
  'Stout',
  'Stowaway',
  'Streamline',
  'Tachometer',
  'Teenager',
  'Tinting',
  'Tournament',
  'Tutor',
  'Twang',
  'Unemployment',
  'Upgrade',
  'Vision',
  'Weed',
  'Will Smith',
  'Zamboni',
  'Zero'
];

const SINGULAR_NOUNS = [
  'Acre',
  'Aisle',
  'Application',
  'Archaeologist',
  'Aristocrat',
  'Armada',
  'Atlantis',
  'Baby',
  'Beanstalk',
  'Beethoven',
  'Blacksmith',
  'Century',
  'Champion',
];