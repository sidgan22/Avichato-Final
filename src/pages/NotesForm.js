import React, { Component } from 'react';

import { db, auth } from "../services/firebase";
class NotesForm extends Component {
    constructor() {
        super();
        this.state = {
            title: '',
            note: '',
            priority:1,
        }

        this.createNote = this.createNote.bind(this);

    this.handleChange = this.handleChange.bind(this);
    }

    onChangeHandler(evt, key) {
        this.setState({
            [key]: evt.target.value
        });
    }


    handleChange(event) {
        this.setState({
          priority: event.target.value
        });
      }
      
  
      

    createNote() {
        if (this.state.title !== '' && this.state.note !== '') {
            var userid = auth().currentUser.uid;

            db.ref('users/' + userid + '/notes').push({
                title: this.state.title,
                note: this.state.note,
                priority: this.state.priority.toString()
            });
        }
    }

    render() {
        return (
            <section className="noteform">
                <h3>Create New Note</h3>
                <div className="form-group">
                    <label htmlFor="noteform-title">Title</label>
                    <input type="text" id="noteform-title" name="noteform-title" value={this.state.title} onChange={(evt) => this.onChangeHandler(evt, 'title')} />
                </div>
                <div className="form-group">
                    <label htmlFor="noteform-note">Note</label>
                    <textarea name="noteform-note" id="noteform-note" value={this.state.note} onChange={(evt) => this.onChangeHandler(evt, 'note')}></textarea>
                </div>
                <form onChangeCapture={this.handleFormSubmit}>
                <div class="rating">
                    {/* ☆ */}
            
          <label>
            <input
              type="radio"
              value="1"
              checked={this.state.priority === "1"}
              onChange={this.handleChange}
            />
            Casual
          </label>
      
          <label>
            <input
              type="radio"
              value="2"
              checked={this.state.priority === "2"}
              onChange={this.handleChange}
            />
            Okayish
          </label>
       
          <label>
            <input
              type="radio"
              value="3"
              checked={this.state.priority === "3"}
              onChange={this.handleChange}
            />
            V.V.Imp
          </label>
        
                </div>
                </form>
                    <button onClick={this.createNote}>Create Note</button>
            </section>
        )
    }
}

export default NotesForm;