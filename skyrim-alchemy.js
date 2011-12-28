"use strict";

var sa = {
    // Variables
    poison: ['Damage','Fear','Frenzy','Paralysis','Ravage','Slow','Weakness'],
    workbench: [],

    // Functions
    search: function(search,list){
        return list.filter(function(item){
            for(var i in [0,1,2,3,4,5]){
                if(item[i].toLowerCase().indexOf(search.toLowerCase()) !== -1){
                    return true;
                }
            }
            return false;
        });
    },
    build_list: function(items){
        var item, temp = '';

        for(item in items){
            temp += this.to_ingredient(items[item]);
        }

        return temp;
    },
    to_ingredient: function(item, action){
        if(action == null){
            action = 'add';
        }

        var temp = '<div class="ingredient" onclick="' + action + '(\'' + item[1] + '\');"><h4>' + item[0] + ' <span class="id">' + item[1] + '</span></h4><ul>';

        for(var i = 2; i <= 5; i++){
            temp += '<li';
            if(this.is_poison(item[i])){
                temp += ' class="poison"';
            }
            temp += '>' + item[i] + '</li>';
        }

        return temp + '</ul></div>';
    },
    get_effects: function(ingredient){
        return [ingredient[2],ingredient[3],ingredient[4],ingredient[5]];
    },
    is_poison: function(effect){
        for(var p in this.poison){
            if(effect.indexOf(this.poison[p]) !== -1){
                return true;
            }
        }
        return false;
    },
    add: function(item){
        if(this.workbench.length < 3){
            var present = false;

            for(var i in this.workbench){
                if(this.workbench[i] === item){
                    present = true;
                }
            }

            if(!present){
                this.workbench.push(item);
            }
        }
        this.update_workbench();
    },
    find: function(id, array){
        for(var i in array){
            if(array[i][1] == id){
                return array[i];
            }
        }
        return false;
    },
    remove: function(id){
        for(var i in this.workbench){
            if(this.workbench[i][1] === id){
                this.workbench.splice(i,1);
            }
        }

        this.update_workbench();
    },
    reset: function(){
        this.workbench = [];
        this.update_workbench();
    },
    update_workbench: function(){
        var temp = '';

        for(var i in this.workbench){
            temp += this.to_ingredient(this.workbench[i], 'remove');
        }

        jQuery('#workbench').html(temp);
    }
};

function add(id)
{
    sa.add(sa.find(id, ingredients));
}

function remove(id)
{
    sa.remove(id);
}

jQuery(document).ready(function(){
    var list = jQuery('#ingredient-list');
    var search = jQuery('#alchemy-search');

    list.html(sa.build_list(ingredients));

    search.keyup(function(){
        jQuery('#ingredient-list').html(sa.build_list(sa.search(jQuery('#alchemy-search').val(),ingredients)));
    });
});