// jshint -W097
"use strict";

var dom = {
  id: function(identifier) {
    return document.getElementById(identifier)
  }
}

// filterElementByClass will return the first item or parent
// that matches the specified class. If it exhausts the list
// of parent items and does not find a match it will return
// null
function filterElementByClass(element, classname) {
  if (element.className === classname) {
    return element
  } else if (element.parentNode != null) {
    return filterElementByClass(element.parentNode, classname)
  } else {
    return null
  }
}

function removeIngredient(args) {
  var el = filterElementByClass(args.target, "ingredient");
  if (el != null) {
    sa.workbench_remove(el.dataset.id);
  }
}

function addIngredient(args) {
  var el = filterElementByClass(args.target, "ingredient");
  if (el != null) {
    sa.workbench_add(sa.find(el.dataset.id, ingredients));
  }
}

function init() {
  // Add click handlers for workbench and ingredient list
  dom.id('ingredient-list').addEventListener('click', addIngredient)
  dom.id('workbench').addEventListener('click', removeIngredient)

  // Make / focus the search bar
  window.addEventListener('keyup', function(event) {
    if (event.keyIdentifier == "U+002F") {
      dom.id('alchemy-search').focus()
      event.stopPropagation()
    }
  })

  // Add key event handler for search box
  dom.id('alchemy-search').addEventListener('keyup', function(event) {
    sa.filter_ingredients_by_search(dom.id('alchemy-search').value)
  })

  // Add change handler for the "Only show ingredients..." checkbox
  dom.id('filter-workbench').addEventListener('change', function () {
    sa.update_workbench()
  })

  // Initialize the list of ingredients
  dom.id('ingredient-list').innerHTML = sa.build_list(ingredients)
}

// Initialize event handlers after the DOM has loaded.
window.addEventListener("load", function load(event) {
  window.removeEventListener("load", load, false)
  init()
});

var sa = {
  poison: ['Damage', 'Fear', 'Frenzy', 'Paralysis', 'Ravage', 'Slow', 'Weakness'],
  workbench: [],

  search_item: function(item, term) {
    for (var i in [0, 1, 2, 3, 4, 5]) {
      if (item[i].toLowerCase().indexOf(term.toLowerCase()) !== -1) {
        return true;
      }
    }
    return false;
  },

  // Build HTML for list of ingredients
  build_list: function (items) {
    var item, temp = '';

    for (item in items) {
      temp += this.to_ingredient(items[item]);
    }

    return temp;
  },

  // Build HTML for this ingredient
  to_ingredient: function (item) {
    var temp = '<div class="ingredient" data-id="' +
      item[1] + '"><h4>' + item[0] + ' <span class="id">' +
      item[1] + '</span></h4><ul>';

    for (var i = 2; i <= 5; i++) {
      temp += '<li';
      if (this.is_poison(item[i])) {
        temp += ' class="poison"';
      }
      temp += '>' + item[i] + '</li>';
    }

    return temp + '</ul></div>';
  },

  // Get list of effects from the specified ingredient
  get_effects: function (ingredient) {
    return [ingredient[2], ingredient[3], ingredient[4], ingredient[5]];
  },

  // Mix ingredients together to get combined list of effects
  mix: function (ingredients) {
    var effects = {}, temp;

    for (var i in ingredients) {
      temp = sa.get_effects(ingredients[i]);

      for (var t in temp) {
        if (!effects.hasOwnProperty(temp[t])) {
          effects[temp[t]] = 1;
        } else {
          effects[temp[t]] += 1;
        }
      }
    }

    return effects;
  },

  // After mixing ingredients, filter effects that match
  mix_filter: function (effects) {
    for (var e in effects) {
      if (effects[e] < 2) {
        delete effects[e];
      }
    }

    return effects;
  },

  // Merge two arrays without duplicate entries
  array_merge_unique: function (array1, array2) {
    array1 = array1.concat(array2).sort();

    for (var a in array1) {
      if (array1[a] == array1[parseInt(a) + 1]) {
        array1.splice(a, 1);
      }
    }

    return array1;
  },

  // Is this effect a poison?
  is_poison: function (effect) {
    for (var p in this.poison) {
      if (effect.indexOf(this.poison[p]) !== -1) {
        return true;
      }
    }
    return false;
  },

  // Add item to workbench
  workbench_add: function (item) {
    if (this.workbench.length < 3) {
      var present = false;

      for (var i in this.workbench) {
        if (this.workbench[i] === item) {
          present = true;
        }
      }

      if (!present) {
        this.workbench.push(item);
      }
    }
    this.update_workbench();
  },

  // Find item by id (e.g. 000a9195)
  find: function (id, array) {
    for (var i in array) {
      if (array[i][1] == id) {
        return array[i];
      }
    }
    return false;
  },

  // Remove item from workbench by id
  workbench_remove: function (id) {
    for (var i in this.workbench) {
      if (this.workbench[i][1] === id) {
        this.workbench.splice(i, 1);
      }
    }

    this.update_workbench();
  },

  // Clear the workbench
  reset: function () {
    this.workbench = [];
    this.update_workbench();
  },

  // Build HTML for workbench and update DOM
  update_workbench: function () {
    var temp = '';
    for (var i in this.workbench) {
      temp += this.to_ingredient(this.workbench[i]);
    }
    dom.id('workbench').innerHTML = temp;

    // this.filter_ingredients()

    if (this.workbench.length !== 0 && sa.check_workbench_filter()) {
      this.filter_ingredients_by_workbench()
    } else {
      this.filter_ingredients_by_search(dom.id('alchemy-search').value)
    }

    sa.update_yield();
  },

  // Build HTML for yield and update DOM
  update_yield: function () {
    var effects = this.mix_filter(this.mix(this.workbench));
    var temp = '<ul>';

    for (var e in effects) {
      temp += '<li' + (sa.is_poison(e) ? ' class="poison"' : '') +
        '>' + e + '</li>';
    }

    dom.id('yield').innerHTML = temp + '</ul>';
  },

  get_workbench_effects: function() {
    var effects = [];
    for (var i in this.workbench) {
      effects = this.array_merge_unique(effects, this.get_effects(this.workbench[i]))
    }
    return effects
  },

  workbench_has: function(search_item) {
    for (var item in this.workbench) {
      if (this.workbench[item][0] == search_item[0]) {
        return true
      }
    }
    return false
  },

  // Hide items in the list that we've already added or don't want to show
  filter_ingredients_by_workbench: function() {
    var that = this;
    this.filter_ingredients_by_function(function(ingredient) {
      // Always hide ingredients that are in the workbench
      if (that.workbench_has(ingredient)) {
        return false
      }
      var effects = that.get_workbench_effects()
      for (var i in effects) {
        if (that.search_item(ingredient, effects[i])) {
          return true
        }
      }
      return false
    })
  },

  filter_ingredients_by_search: function(term) {
    var that = this;
    this.filter_ingredients_by_function(function(ingredient) {
      // Always hide ingredients that are in the workbench
      if (that.workbench_has(ingredient)) {
        return false
      }
      return that.search_item(ingredient, term)
    })
  },

  // Pass in a callback to be called on a DOM element.
  // If the callback returns true, the item will be displayed.
  // If the callback returns false, the item will be hidden.
  //
  // WARNING: #ingredient-list and var ingredients have to have
  // the same contents in the same order or this will not work.
  filter_ingredients_by_function: function(func) {
    var ingredientList = dom.id('ingredient-list').children
    for (var i = 0; i < ingredients.length; i++) {
      // Check if the callback is true/false and apply the change to the class
      // if an only if we need to. The DOM is evaluated when add/remove is called
      // even if the list is not changed so don't take action unless necessary.
      var classes = ingredientList[i].classList
      if (func(ingredients[i])) {
        if (classes.contains("hidden")) {
          classes.remove("hidden")
        }
      } else {
        if (!classes.contains("hidden")) {
          classes.add("hidden")
        }
      }
    }
  },

  check_workbench_filter: function () {
    return (dom.id('filter-workbench').checked);
  }
};
