

var data = {
  initial: ['stay-in', 'go-out'],
  choices: {
    
    // TOP LEVEL
    
    'stay-in': {
      name: 'Stay In',
      children: ['watch-movie', 'watch-tv', 'cook']
    },
    
    'go-out': {
      name: 'Go Out',
      children: ['cinema', 'drink', 'restaurant']
    },
    
    // STAY IN
    
    'watch-movie': {
      name: 'Watch a movie',
      children: ['romantic', 'scary', 'action', 'comedy']
    },
    'watch-tv': {
      name: 'Watch a TV show',
      children: ['drama', 'sport', 'comedy-tv']
    },
    'cook': {
      name: 'Cook a meal',
      children: ['spicy', 'traditional']
    },
    
    // GO OUT
    
    'cinema': {
      name: 'Go to the cinema',
      children: ['romantic-cine', 'scary-cine']
    },
    'drink': {
      name: 'Have a drink',
      children: ['beer', 'whiskey']
    },
    'restaurant': {
      name: 'Visit a restaurant',
      children: ['italian', 'bbq']
    },
    
    // WATCH MOVIE
    
    'romantic': {
      name: 'Holding hands'
    },
    'scary': {
      name: 'Terrified'
    },
    'action': {
      name: 'On the edge of our seats'
    },
    'comedy': {
      name: 'Spit out our popcorn'
    },
    
    // WATCH TV 
    
    'drama': {
      name: 'Nail-biting suspense'
    },
    'sport': {
      name: 'Cheer for the winner'
    },
    'comedy-tv': {
      name: 'Cry with laughter'
    },
    
    // COOK
    'spicy': {
      name: 'Hot and spicy'
    },
    'traditional': {
      name: 'Like Mum used to make'
    },
    
    // CINEMA
    'romantic-cine': {
      name: 'Make out at the back'
    },
    'scary-cine': {
      name: 'Covering our faces'
    },
    
    // DRINK
    'beer': {
      name: 'Pisswasser'
    },
    'whiskey': {
      name: 'Black Bush'
    },
    
    // RESTAURANT
    'italian': {
      name: 'Spag bol'
    },
    'bbq': {
      name: 'Meat in a bap'
    }
    
  }
};
