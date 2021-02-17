const API_TOKEN = "37b24c7f861086cb1755e641b8ecfaa1"

export function getFilmsFromApiWithSearchedText (text) {
    const url = 'https://api.themoviedb.org/3/search/movie?api_key=' + API_TOKEN + '&language=fr&query=' + text
    // fetch : js library
    return fetch(url)
    // then function: converts the response from our API to JSON and returns it.
      .then((response) => response.json())
      .catch((error) => console.error(error))
  }

  // create URL
  // https://developers.themoviedb.org/3/getting-started/images
  
  export function getImageFromApi (name) {
    return 'https://image.tmdb.org/t/p/w300' + name
  }
