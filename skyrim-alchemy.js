"use strict";

var poison = ['Damage','Fear','Frenzy','Paralysis','Ravage','Slow','Weakness'];

var sa = {
    search: function(){

    },
    build_list: function(items){
        var item, temp = '';

        for(item in items){
            temp += '<div class="ingredient"><h4>' + items[item][0] + ' <span class="id">' + items[item][1] + '</span></h4><ul>';
            for(var i = 2; i <= 5; i++){
                temp += '<li';
                if(this.is_poison(items[item][i])){
                    temp += ' class="poison"';
                }
                temp += '>' + items[item][i] + '</li>';
            }
            temp += '</ul></div>';
        }

        return temp;
    },
    is_poison: function(effect){
        for(var p in poison){
            if(effect.indexOf(poison[p]) !== -1){
                return true;
            }
        }
        return false;
    }
};