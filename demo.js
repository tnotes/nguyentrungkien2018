var array1 = [{ id: "abdc4051", date: "2017-01-24" }, { id: "abdc4052", date: "2017-01-22" }],
    array2 = [{ id: "abdc4051", name: "ab" }, { id: "abdc4052", name: "abc" }],
    result = [array1, array2].reduce((a, b) => a.map((c, i) => Object.assign({}, c, b[i])));
console.log(result)