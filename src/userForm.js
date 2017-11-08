import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

const styles = {
  radioButtonGroup: {
    marginTop: 20,
  },
  radioButton: {
    marginBottom: 16,
  },
  form: {
    marginRight: '5%',
  },
  flatButton: {
    marginTop: 20,
  }
};


export default class UserForm extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.v = {
      firstName: { rule: /^[A-Za-z\-\s]+$/, errText: 'Can only contain letters, hyphens and spaces', touched: false, valid: false},
      lastName: { rule: /^[A-Za-z\-\s]+$/, errText: 'Can only contain letters, hyphens and spaces', touched: false, valid: false},
      age: { rule: /^[1-9][0-9]?$/, errText: 'Must be in range from 1 to 99', touched: false, valid: false},
      phone: { rule: /^\d{3,12}$/, errText: 'Can only contain 3 to 12 digits', touched: false, valid: false},
    };
    this.open = false;
  }

  handleSubmit(e) {
    if (this.isFormValid()) {
      for (let key in this.v) {
        if (this.v.hasOwnProperty(key)) {
          this.v[key].touched = false;
          this.v[key].valid = false;
        }
      }
      this.props.addUser();
      e.target.reset();
    } else {
      alert('User wasn\'t added. Please fill all fields correctly');
    }
    e.preventDefault();
  }

  handleChange(e) {
    const target = e.target;
    let value;
    if (target.name !== 'gender') {
      value = target.value;
      this.v[target.name].touched = true;
      this.v[target.name].valid = UserForm
        .isFieldValid(value, this.v[target.name].rule);
    }
    this.props.changeData(target.name, target.value);
  }

  static isFieldValid(str, regexp) {
    return regexp.test(str);
  }

  isFormValid() {
    let isValid = true;
    for (let key in this.v) {
      if (this.v.hasOwnProperty(key)) {
        isValid = isValid && this.v[key].valid;
      }
    }
    return isValid;
  }

  msg(key) {
    return  this.v[key].touched && !this.v[key].valid
      ? this.v[key].errText
      : '';
  }

  render() {
    return (
      <MuiThemeProvider>
        <Paper zDepth={2}>
          <form onSubmit={this.handleSubmit}>
            <TextField name='firstName'
                       onChange={ this.handleChange }
                       errorText={ this.msg('firstName') }
                       floatingLabelText='First name'/>
            <TextField name='lastName'
                       onChange={ this.handleChange }
                       errorText={ this.msg('lastName')}
                       floatingLabelText='Last name'/>
            <TextField name='phone'
                       onChange={ this.handleChange }
                       errorText={ this.msg('phone')}
                       floatingLabelText='Phone'/>
            <div className='input-container'>
              <label className='input-label container'>Male
                <input type='radio'
                       className='input'
                       onChange={ this.handleChange }
                       name='gender'
                       label='Male'
                       style={styles.radioButton}
                       value={false}/>
                <span className="checkmark"></span>
              </label>
              <label className='input-label container'>Female
                <input type='radio'
                       className='input'
                       onChange={ this.handleChange }
                       name='gender'
                       label='Female'
                       style={styles.radioButton}
                       value={true}/>
                <span className="checkmark"></span>
              </label>
            </div>
            <TextField name='age'
                       floatingLabelText='Age'
                       type='number'
                       onChange={ this.handleChange }
                       errorText={ this.msg('age') }/>
            <FlatButton label='Add user'
                        style={styles.flatButton}
                        type='submit'
                        primary={true}/>
          </form>
        </Paper>
      </MuiThemeProvider>
    )
  }
}

UserForm.PropTypes = {
  user: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    phone: PropTypes.string,
    gender: PropTypes.string,
    age: PropTypes.string,
  }),
  addUser: PropTypes.func,
  changeData: PropTypes.func,
};
