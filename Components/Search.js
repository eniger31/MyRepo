// Components/Search.js

import React from 'react'
import { StyleSheet, View, TextInput, Button, Text, FlatList, ActivityIndicator } from 'react-native'
//import films from '../Helpers/filmsData'
import FilmItem from './FilmItem'
import { getFilmsFromApiWithSearchedText } from '../API/TMDBApi'


class Search extends React.Component {

    // component constructor with parameters props by default
    constructor(props) {
        super(props)
        // ..... Outside STATE
        // Initialize our searchedText data outside the state because no need to reload the rendering
        this.searchedText = "" 
        // Scroll page : 2 props 
        this.page = 0
        this.totalPages = 0 
        // ..... In STATE 
        this.state = { 
            films: [],
            isLoading: false // not loading on going
         }
      }

    // my funcion
    _loadFilms() {
        // recover movies from api
        // setSTATE to modify the state 
        // getFilmsFromApiWithSearchedText("star").then(data => console.log(data))
        // getFilmsFromApiWithSearchedText("star").then(data => this.setState( {films: data.results}))
        if (this.searchedText.length > 0) { // if field not empty
            this.setState({ isLoading: true})
            getFilmsFromApiWithSearchedText(this.searchedText, this.page+1 ).then(data => {
                this.page = data.page
                this.totalPages = data.total_pages
                this.setState
                ({ 
                    // pour ne oas écraser les films de la page pécédente
                    //to NOT overwrite the movies of the previous page, do a copy with ...
                    // films: data.results,
                    films: data.results,
                    films: [ ...this.state.films, ...data.results ],
                    // end research
                    isLoading: false
                })
             })
        }
    }

    _searchTextInputChanged(text) {
        // Modification du texte recherché à chaque saisie de texte
        // Modification of the text searched for each text entry
        this.searchedText = text
    }
    
    _displayLoading() {
        if (this.state.isLoading) {
            // ON RETOURNE une VUE en JSX si XXX
          return (
            <View style={styles.loading_container}>
              <ActivityIndicator 
              //The ActivityIndicator component has a size property to define the size of the loading visual}
              //small or large. By default size is small, we therefore put large so that the loading is clearly visible }
              size='large' />
            </View>
          )
        }
      }

      _searchFilms(){
          // to reset our data for a new RESEARCH
          this.page = 0 
          this.totalPages = 0
          this.setState ({
              films: []
          }, () => {
            // check & start a new search LINK (fonction fléchée) and AFTER reset setState (because setState is asynchonimous)
            console.log("Page : " + this.page + " / TotalPages : " + this.totalPages + " / Nombre de films : " + this.state.films.length)
            this._loadFilms()
          })
            // check & start a new search
            //console.log("Page : " + this.page + " / TotalPages : " + this.totalPages + " / Nombre de films : " + this.state.films.length)
            //this._loadFilms()
      }

  render() {
      //console.log("RENDER")
      //console.log("LOADER", this.state.isLoading)
    return (
      <View style={styles.main_container}>
        <TextInput 
        style={styles.textinput} 
        placeholder='Titre du film'
        // searchTextInputChange reçoit le texte saisi à chaque caractère écrit dans l'input
        // searchTextInputChange receives the text entered for each character written in the input field
        onChangeText={(text) => this._searchTextInputChanged(text)}
        // To validate on ENTER (additional option)
        onSubmitEditing={() => this._searchFilms()}
        />
        <Button title='Search ... Regina !' onPress={() => this._searchFilms()}/>
        <FlatList
            // data={films}
            data={this.state.films}
            keyExtractor={(item) => item.id.toString()}
            // Afficher le scroll dès que la fin de la page arrive à 1/2de l'écran
            // Display the scroll as soon as the end of the page reaches 1/2 of the screen
            onEndReachedThreshold={0.5}
            onEndReached= { () => { 
                // check limit page 
                console.log("OnEndReached ..... BEFORE", this.totalPages)
                // LIMIT 2 page instead a full scrolling 
                // if (this.page < this.totalPages)
                if (this.page < 2)
                { 
                    console.log("OnEndReached .....")
                    this._loadFilms()
                }
                
            }}
            //give the props film to my component FilmItem
            renderItem={({item}) => <FilmItem film={item}/>}
        />
        {this._displayLoading()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    marginTop: 20,
  },
  textinput: {
    marginLeft: 5,
    marginRight: 5,
    height: 50,
    borderColor: '#000000',
    borderWidth: 1,
    paddingLeft: 5
  },
  loading_container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 100,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default Search