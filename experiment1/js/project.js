// project.js - purpose and description here
// Author: Garrett Blake
// Date: 4/3/2024

// NOTE: This is how we might start a basic JavaaScript OOP project

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file

// define a class
class MyProjectClass {
  // constructor function
  constructor(param1, param2) {
    // set properties using 'this' keyword
    this.property1 = param1;
    this.property2 = param2;
  }
  
  // define a method
  myMethod() {
    // code to run when method is called
  }
}

function main() {
  // Format is verb, connector, noun
  const fillers = {
    begin: ["Conquer", "Dominate", "Live", "Master", "Feel", "", "Educate", "Stimulate"],
    middle: ["your", "", ",", "more than just your"],
    end: ["Emotions", "Habits", "Self", "Family", "Art", "Daily Routine", "Routine", "Bank Account", "Relationships", "Body"]
  };

  const template = `$begin $middle $end`;


  // STUDENTS: You don't need to edit code below this line.

  const slotPattern = /\$(\w+)/;

  function replacer(match, name) {
    let options = fillers[name];
    if (options) {
      return options[Math.floor(Math.random() * options.length)];
    } else {
      return `<UNKNOWN:${name}>`;
    }
  }

  function generate() {
    let story = template;
    while (story.match(slotPattern)) {
      story = story.replace(slotPattern, replacer);
    }

    /* global box */
    $("#box").text(story);
  }

  /* global clicker */
  $("#clicker").click(generate);

  generate();
}

// let's get this party started - uncomment me
main();