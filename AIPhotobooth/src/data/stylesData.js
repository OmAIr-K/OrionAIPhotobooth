// Import style images
import ironManStyle from '../assets/images/Iron_Man_Style.jpg';
import mafiaStyle from '../assets/images/Mafia_Boss_Style.jpg';
import cyberpunkStyle from '../assets/images/Cyberpunk_Style.jpg';
import queenStyle from '../assets/images/Queen_Style.jpg';
import jonSnowStyle from '../assets/images/Jon_Snow_Style.jpg';
import airQueenStyle from '../assets/images/Air_Queen_Style.jpg';
import eternalsStyle from '../assets/images/Eternals_Style.png';
import animeStyle from '../assets/images/Anime_Style.jpg';
import spiderManStyle from '../assets/images/SpiderMan_Style.jpg';
import captainAmericaStyle from '../assets/images/Captain_America_Style.jpg';
import superManStyle from '../assets/images/SuperMan_Style.jpg';
import casualStyle from '../assets/images/Casual_Style_F.jpg';
import fireQueenStyle from '../assets/images/Fire_Queen_Style.jpg';
import ironWomanStyle from '../assets/images/Iron_Woman_Style.jpg';
import flashStyle from '../assets/images/Flash_Style.jpg';
import spiderWomanStyle from '../assets/images/Spider_Woman_Style.jpg';
import captainMarvelStyle from '../assets/images/Captain_Marvel_Stylt.png';
import customStyleIcon from '../assets/images/Custom_Style.jpg';

// Sample styles for the home carousel
export const sampleStyles = [
  { 
    id: 'iron_man', 
    name: "Iron Man", 
    image: ironManStyle, 
    description: "Become a high-tech armored superhero with advanced weaponry" 
  },
  { 
    id: 'air_queen', 
    name: "Air Kingdom Queen", 
    image: airQueenStyle, 
    description: "Conquer the skies with your powerful wings and majestic presence" 
  },
  { 
    id: 'fire_queen', 
    name: "Fire Royalty", 
    image: fireQueenStyle, 
    description: "Embrace your inner fire elemental with regal authority" 
  },
  { 
    id: 'captain_america', 
    name: "Captain America", 
    image: captainAmericaStyle, 
    description: "Become a patriotic superhero with a shield and a strong sense of justice" 
  },
  { 
    id: 'spider_man', 
    name: "Spider Man", 
    image: spiderManStyle, 
    description: "Transform into a web-slinging vigilante with amazing powers" 
  },
  { 
    id: 'anime', 
    name: "Anime Style", 
    image: animeStyle, 
    description: "Dive into the world of anime with vibrant colors and dynamic poses" 
  },
  { 
    id: 'jon_snow', 
    name: "Jon Snow", 
    image: jonSnowStyle, 
    description: "Channel the brooding hero of the north with ice and snow" 
  },
  { 
    id: 'cyberpunk', 
    name: "Cyberpunk", 
    image: cyberpunkStyle, 
    description: "Enter a futuristic cyberpunk universe with neon and tech" 
  },
  { 
    id: 'casual_cool', 
    name: "Casual Cool", 
    image: casualStyle, 
    description: "Showcase your natural beauty with confidence and contemporary flair" 
  }
];

// Style options based on gender
export const styleOptions = {
  male: [
    { 
      id: 'custom', 
      name: "Custom Style", 
      image: customStyleIcon,
      description: "Create your own custom style using text prompts", 
      popularity: 98,
      features: ["Personalized", "Custom prompt", "Unique creation"],
      isCustom: true
    },
    { 
      id: 'iron_man', 
      name: "Iron Man", 
      image: ironManStyle, 
      description: "High-tech armored superhero with advanced weaponry and flight", 
      popularity: 95,
      features: ["Flight capabilities", "Energy repulsors", "Advanced AI assistant"]
    },
    { 
      id: 'superman', 
      name: "Superman", 
      image: superManStyle, 
      description: "The Man of Steel with incredible strength and ability to fly", 
      popularity: 94,
      features: ["Super strength", "Flight", "Heat vision", "X-ray vision"]
    },
    { 
      id: 'mafia_boss', 
      name: "Mafia Boss", 
      image: mafiaStyle, 
      description: "Powerful crime lord with impeccable style and commanding presence", 
      popularity: 87,
      features: ["Elite style", "Authoritative presence", "Vintage aesthetic"]
    },
    { 
      id: 'captain_america', 
      name: "Captain America", 
      image: captainAmericaStyle, 
      description: "Become a patriotic superhero with a shield and a strong sense of justice", 
      popularity: 87,
      features: ["Elite style", "Authoritative presence", "Vintage aesthetic"]
    },
    { 
      id: 'cyberpunk_hacker', 
      name: "Cyberpunk Rebel", 
      image: cyberpunkStyle, 
      description: "Futuristic tech-enhanced fighter in a neon-lit dystopia", 
      popularity: 92,
      features: ["Neon highlights", "Cybernetic enhancements", "Futuristic tech"]
    },
    { 
      id: 'jon_snow', 
      name: "Jon Snow", 
      image: jonSnowStyle, 
      description: "Brooding warrior from the north with a noble heart", 
      popularity: 91,
      features: ["Winter aesthetic", "Medieval armor", "Battle-worn appearance"]
    },
    { 
      id: 'lightning_hero', 
      name: "The Flash", 
      image: flashStyle, 
      description: "Fastest man alive with lightning speed and reflexes", 
      popularity: 89,
      features: ["Super speed", "Lightning effects", "Dynamic motion blur"]
    },
    { 
      id: 'spider_man', 
      name: "Spider Man", 
      image: spiderManStyle, 
      description: "Transform into a web-slinging vigilante with amazing powers",
      popularity: 92,
      features: ["Web-slinging", "Spider-like abilities", "Dynamic motion blur"]
    }
    
  ],
  female: [
    { 
      id: 'custom', 
      name: "Custom Style", 
      image: null,
      description: "Create your own custom style using text prompts", 
      popularity: 98,
      features: ["Personalized", "Custom prompt", "Unique creation"],
      isCustom: true
    },
    { 
      id: 'iron_man', // Using iron_man since there's no specific iron_woman in STYLE_PROMPTS
      name: "Iron Woman", 
      image: ironWomanStyle, 
      description: "Powerful armored heroine with cutting-edge technology", 
      popularity: 93,
      features: ["Advanced armor", "Energy weapons", "Flight capability"]
    },
    { 
      id: 'fire_queen', 
      name: "Fire Queen", 
      image: fireQueenStyle, 
      description: "Majestic ruler with mastery over flames and heat", 
      popularity: 90,
      features: ["Fire effects", "Regal appearance", "Mystical aura"]
    },
    { 
      id: 'princess_hj', 
      name: "Queen Regent", 
      image: queenStyle, 
      description: "Royal monarch with commanding presence and regal bearing", 
      popularity: 88,
      features: ["Royal attire", "Crown and jewels", "Majestic background"]
    },
    { 
      id: 'spider_woman', 
      name: "Spider Woman", 
      image: spiderWomanStyle, 
      description: "Agile web-slinging heroine with spider-like abilities", 
      popularity: 92,
      features: ["Web effects", "Spider insignia", "Action pose"]
    },
    { 
      id: 'space_captain', 
      name: "Captain Marvel", 
      image: captainMarvelStyle, 
      description: "Cosmic powerhouse and one of the universe's mightiest heroes", 
      popularity: 94,
      features: ["Energy aura", "Cosmic powers", "Heroic pose"]
    },
    { 
      id: 'gamer_fm', 
      name: "Casual Cool", 
      image: casualStyle, 
      description: "Modern, stylish look with confidence and contemporary flair", 
      popularity: 85,
      features: ["Modern fashion", "Natural style", "Urban setting"]
    }
  ]
}; 