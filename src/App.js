import './App.css';
import { useState, useEffect } from 'react';

function App() {

  let [recipes, setRecipes] = useState([]);
  let [editRecipeId, setEditRecipeId] = useState(-1);
  let [editedName, setEditedName] = useState("");
  let [editedRecipe, setEditedRecipe] = useState("");

  let createRecipe = () => {
    console.log("Created Recipe")
    fetch('http://localhost:3001/create', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "dishName": document.getElementById('dish-name').value,
        "recipe": document.getElementById('recipe').value
      })
    })
  }

  let getRecipes = () => {
    fetch('http://localhost:3001',).then((response) => {
      return response.json();
    }).then((data) => {
      setRecipes(data)
    })
  }

  let deleteRecipe = (id) => {
    fetch(`http://localhost:3001/delete/${id}`, {
      method: 'DELETE'
    }).then((response) => {
      getRecipes();
    }).catch((err) => {
      console.log(err);
    });
  }

  let updateRecipe = (id) => {
    let changingName = document.getElementById(`recipe-name-${id}`).value;
    let changingRecipe = document.getElementById(`recipe-${id}`).value;
    console.log("changing Name is " + changingName + " Changing Recipe is " + changingRecipe);

    let data = {
      "id": id,
      "name": changingName,
      "recipe": changingRecipe
    }

    fetch('http://localhost:3001/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        getRecipes();
        setEditRecipeId(-1)
        return response.json()
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  useEffect(() => {
    getRecipes();
  }, []);

  let recipesBlocks = recipes.map((recipe) => {
    return (
      recipe["id"] === editRecipeId ?
        <div className="card m-2" style={{ width: "18rem" }}>
          <div className="card-body">
            <input id={`recipe-name-${recipe["id"]}`} className="card-title"
              onChange={(e) => { setEditedName(e.target.value) }} value={editedName === '' ? recipe['name'] : editedName} />
            <textarea id={`recipe-${recipe["id"]}`} className="card-text" value={editedRecipe === '' ? recipe['recipe'] : editedRecipe}
              onChange={(e) => { setEditedRecipe(e.target.value) }} />
            <div className='d-flex d-flex-row justify-content-around w-75'>
              <button type="button" className="btn btn-primary" onClick={() => { updateRecipe(recipe["id"]) }}>Save</button>
              <button type="button" className="btn btn-dark" onClick={() => {
                setEditRecipeId(-1);
                setEditedRecipe("");
                setEditedName("");
              }}>Cancel</button>
            </div>
          </div>
        </div> :
        <div className="card m-2" style={{ width: "18rem" }}>
          <div className="card-body">
            <h5 className="card-title">{recipe["name"]}</h5>
            <p className="card-text">{recipe["recipe"]}</p>
            <div className='d-flex d-flex-row justify-content-around w-75'>
              <button type="button" className="btn btn-danger" onClick={() => { deleteRecipe(recipe["id"]) }}>Delete</button>
              <button type="button" className="btn btn-dark" onClick={() => { setEditRecipeId(recipe["id"]); }}>Edit</button>
            </div>
          </div>
        </div>
    )
  });
  return (
    <>
      <form onSubmit={createRecipe} className="row g-3 container w-50 p-3 mx-auto">
        <div className="mb-3">
          <label for="dish-name" className="form-label">Dish Name</label>
          <input type="text" className="form-control" id="dish-name" placeholder="Dish Name" />
        </div>
        <div className="mb-3">
          <label for="recipe" className="form-label">Recipe</label>
          <textarea className="form-control" id="recipe" rows="3"></textarea>
        </div>
        <div className="mb-3">
          <input type="submit" value="Submit" className="btn btn-primary w-25 " />
        </div>
      </form>
      <hr />
      <div className=' d-flex flex-row flex-wrap w-75 m-auto'>
        {recipesBlocks}
      </div>
    </>
  );
}

export default App;
