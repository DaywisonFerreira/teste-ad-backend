module.exports = function(array) {
  let index_current = array.length, value_temp, index_random; 
 
    while (0 !== index_current) {
 
        index_random = Math.floor(Math.random() * index_current);
        index_current -= 1;
 
        value_temp = array[index_current];
        array[index_current] = array[index_random];
        array[index_random] = value_temp;
    }
 
    return array;
} 