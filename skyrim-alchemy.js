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
    to_ingredient: function(item){
        var temp = '<div class="ingredient"><h4>' + item[0] + ' <span class="id">' + item[1] + '</span></h4><ul>';

        for(var i = 2; i <= 5; i++){
            temp += '<li';
            if(this.is_poison(item[i])){
                temp += ' class="poison"';
            }
            temp += '>' + item[i] + '</li>';
        }

        return temp + '</ul></div>';
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
        this.draw_workbench();
    },
    remove: function(id){
        var temp = [];

        for(var i in this.workbench){
            if(this.workbench[i][1] !== id){
                temp.push(this.workbench[i]);
            }
        }

        this.workbench = temp;
        this.draw_workbench();
    },
    reset: function(){
        this.workbench = [];
        this.draw_workbench();
    },
    draw_workbench: function(){
        var temp = '';

        for(var i in this.workbench){
            temp += this.to_ingredient(this.workbench[i]);
        }

        jQuery('#workbench').html(temp);
    }
};

jQuery(document).ready(function(){
    var list = jQuery('#ingredient-list');
    var search = jQuery('#alchemy-search');

    list.html(sa.build_list(ingredients));

    search.keyup(function(){
        jQuery('#ingredient-list').html(sa.build_list(sa.search(jQuery('#alchemy-search').val(),ingredients)));
    });
});