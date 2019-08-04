let results = [];
localStorage.setItem("myLibrary", JSON.stringify({results:[], total_results: 0}));

function getResults(query, mode = 0, filter, page = 1){

     //replace the api_key value with your own api_key generated from https://www.themoviedb.org/account/signup

     let api_key = "9f39d68fa09fd7d5903c60p16cd342f0";
    if(mode == 1){
        fetch(`https://api.themoviedb.org/3/search/${filter}?query=${query}&api_key=${api_key}&page=${page}`)
        .then(response => response.json())
        .then(data => {
            results = data.results;
            renderHTML(data)
        });    
    }else{
        let myLibrary = JSON.parse(localStorage.getItem("myLibrary"));
        renderHTML(myLibrary);
    }
}

function renderHTML(movies){
    
    try{

        let str = "";
        
        for(i=1; i<=movies.total_pages; i++ ){
            str = str.concat(`<a onclick="getResults('${document.getElementById('query').value}', 1, '${document.getElementById('filter').value}', ${i})">${i}<a/>`); 
        }
        
        document.getElementById("pages").innerHTML = str;
        
         if(movies.results.length){

            

            str = movies.results.map(item =>{
                let img = item.poster_path ? `https://image.tmdb.org/t/p/w185_and_h278_bestv2${item.poster_path}`: './default_poster.jpg';
                return `
                <div class="outer">
                    <div class="movie_item">
                        <img src=${img} /><br/>
                        <strong>${item.title || item.original_name}</strong>
                    </div>
                    <div class='btn_add'>
                        <button class="add_btn" onclick="addMovie(${item.id})">Add</button>
                    </div>
                </div>`
            }).join().replace(/,/g,'');
        }
        else{
            str = `<p>No Movies Found!!!</p>`; 
        }
    
        document.getElementById("app").innerHTML = str;
    }catch(error){
        console.log("Unable to fetch some images", error);
    }
    
}




function addMovie(id){
    let myLibrary = JSON.parse(localStorage.getItem("myLibrary"));
    let exist;
    
    if(Array.isArray(myLibrary.results)){
        exist = myLibrary.results.find(item => item.id == id);
        let found = !exist && myLibrary.results.push(results.find(movie => movie.id == id));
        myLibrary.total_pages = Math.ceil(myLibrary.results.length/20);
    }
    localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
    
    if(!exist){
        alert("Added to My Library");   
    }else{
        alert("Already exist in library");
    }
}