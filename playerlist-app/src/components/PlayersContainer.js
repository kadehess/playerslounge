import React, { Component } from 'react'
 import axios from 'axios'
 import update from 'immutability-helper'

 class PlayersContainer extends Component {
   constructor(props) {
     super(props)
     this.state = {
       players: [],
       inputValue: ''
     }
 	}

   getPlayers() {
     axios.get('/api/v1/players')
     .then(response => {
       this.setState({players: response.data})
     })
     .catch(error => console.log(error))
   }

   createPlayerlist = (e) => {
     if (e.key === 'Enter' && !(e.target.value === '')) {
       axios.post('/api/v1/players', {playerlist: {title: e.target.value}})
       .then(response => {
         const players = update(this.state.players, {
           $splice: [[0, 0, response.data]]
         })
         this.setState({
           players: players,
           inputValue: ''
         })
       })
       .catch(error => console.log(error))      
     }    
   }

   handleChange = (e) => {
     this.setState({inputValue: e.target.value});
   }

   updatePlayerlist = (e, id) => {
     axios.put(`/api/v1/players/${id}`, {playerlist: {done: e.target.checked}})
     .then(response => {
       const playerlistIndex = this.state.players.findIndex(x => x.id === response.data.id)
       const players = update(this.state.players, {
         [playerlistIndex]: {$set: response.data}
       })
       this.setState({
         players: players
       })
     })
     .catch(error => console.log(error))      
   }

   deletePlayerlist = (id) => {
     axios.delete(`/api/v1/players/${id}`)
     .then(response => {
       const playerlistIndex = this.state.players.findIndex(x => x.id === id)
       const players = update(this.state.players, {
         $splice: [[playerlistIndex, 1]]
       })
       this.setState({
         players: players
       })
     })
     .catch(error => console.log(error))
   }

   componentDidMount() {
     this.getPlayers()
 	}

   render() {
     return (
       <div>
         <div className="inputContainer">
           <input className="athleteInput" type="text" 
             placeholder="Add an athlete" maxLength="50"
             onKeyPress={this.createPlayerlist}
             value={this.state.inputValue} onChange={this.handleChange} />
         </div>        
         <div className="listWrapper">
           <ul className="athleteList">
             {this.state.players.map((playerlist) => {
               return(
                 <li className="athlete" key={playerlist.id}>
                   <input className="athleteCheckbox" type="checkbox" 
                     checked={playerlist.done}
                     onChange={(e) => this.updatePlayerlist(e, playerlist.id)} />              
                   <label className="athleteLabel">{playerlist.title}</label>
                   <span className="deleteAthleteBtn" 
                     onClick={(e) => this.deletePlayerlist(playerlist.id)}>
                     x
                   </span>
                 </li>
               )       
             })}        
           </ul>
         </div>
       </div>
     )
   }
 }

 export default PlayersContainer