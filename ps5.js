/**
* Returns a list of objects grouped by some property. For example:
* groupBy([{name: 'Steve', team:'blue'}, {name: 'Jack', team: 'red'}, {name: 'Carol', team: 'blue'}], 'team')
* *
returns:
* { 'blue': [{name: 'Steve', team: 'blue'}, {name: 'Carol', team: 'blue'}],
* 'red': [{name: 'Jack', team: 'red'}]
* }
* *
@param {any[]} objects: An array of objects
* @param {string|Function} property: A property to group objects by
* @returns An object where the keys representing group names and the values are the items in objects that are in
that group
*/
function groupBy(objects, property) {
    // If property is not a function, convert it to a function that accepts one argument (an object) and returns that object's
    // value for property (obj[property])
    if (typeof property !== 'function') {
        const propName = property;
        property = (obj) => obj[propName];
    }
    const groupedObjects = new Map();
    // Keys: group names, value: list of items in that group
    for (const object of objects) {
        const groupName = property(object);
        //Make sure that the group exists
        if (!groupedObjects.has(groupName)) {
            groupedObjects.set(groupName, []);
        }
        groupedObjects.get(groupName).push(object);
    }
    // Create an object with the results.Sort the keys so that they are in a sensible "order"
    const result = {};
    for (const key of Array.from(groupedObjects.keys()).sort()) {
        result[key] = groupedObjects.get(key);
    }
    return result;
}



var list = [];
var saved_words = [];
var ml = [];


showdata()

function showdata() {
    if (localStorage.getItem('saved_words') != null) {
        saved_words = JSON.parse(localStorage.getItem('saved_words'))
        document.querySelector('#saved_words').innerHTML = saved_words.join(',')
    }
}
/* Show rhyming words */
document.querySelector('#show_rhymes').addEventListener('click', function () {
    var txt = document.querySelector('#word_input').value;
    if (txt != '') {
        search(txt, 1)
    }
})
/* Show synonyms */
document.querySelector('#show_synonyms').addEventListener('click', function () {
    var txt = document.querySelector('#word_input').value;
    if (txt != '') {
        search(txt, 2)
    }
})
/* enter key */
document.addEventListener('keydown', function (event) {

    if (event.keyCode == '13') {
        var txt = document.querySelector('#word_input').value;
        if (txt != '') {
            search(txt, 1)
        }
    }
})
/* search */
function search(txt, type) {
    document.querySelector('#word_output').innerHTML = '…loading'
    var url = ' ';
    if (type == 1) {
        url = `https://api.datamuse.com/words?rel_rhy=${txt}`;
        document.querySelector('#output_description').innerHTML = `Words that rhyme with ${txt}`
    } else {
        url = `https://api.datamuse.com/words?ml=${txt}`;
        document.querySelector('#output_description').innerHTML = `Words with a similar meaning to ${txt}`
    }
    fetch(url, {
        method: 'GET',
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        }
    }).then(response => response.json())
        .then((res) => {
            console.log(res)
            if (res.length == 0) {
                document.querySelector('#word_output').innerHTML = 'no results'
            } else {
                document.querySelector('#word_output').innerHTML = ''
                // console.log(groupBy(res, 'numSyllables'))
                // console.log(groupBy(res, 'numSyllables'))
                let result = '';
                if (type == '1') {
                    result = groupBy(res, 'numSyllables')
                } else if (type == '2') {
                    result = groupBy(res, 'tags')
                }
                showresult(result, type)
            }

        }).catch((err) => {
            console.log(err)
        })
}

function showresult(result, type) {
    console.log(result)
    let values = Object.values(result);
    let keys = Object.keys(result);
    console.log(values)
    console.log(keys)
    list = values;
    keys.forEach((dom, index) => {
        console.log(dom + 'Syllables')

        if (type == '1') {
            let h3 = document.createElement('h3')
            h3.innerText = dom + '——Syllables';
            document.querySelector('#word_output').append(h3)
        } else if (type == '2') {
            let h3 = document.createElement('h3')
            h3.innerText = dom + '——tages';
            document.querySelector('#word_output').append(h3)
        }
        let ul = document.createElement('ul');
        values[index].forEach((ele, i) => {
            let li = document.createElement('li');
            let button = document.createElement('button');
            li.innerText = ele.word;
            button.classList = "save btn btn-outline-success";
            button.innerText = "save";
            button.addEventListener('click', function () {
                savebtn(index, i)
            })
            li.append(button)
            ul.append(li);
            document.querySelector('#word_output').append(ul)
        })

    })
    return false;

}

function savebtn(index, i) {
    console.log(index)
    console.log(i)
    console.log(list)
    saved_words.push(list[index][i].word)
    localStorage.setItem('saved_words', JSON.stringify(saved_words))


    alert('success');
    showdata()
}