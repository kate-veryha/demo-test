import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import UserForm from './userForm';
import UserList from './userTable';

import './index.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.cols = [
      { key: 'firstName', label:'First name' },
      { key: 'lastName', label: 'Last name' },
      { key: 'phone', label: 'Phone' },
      { key:'gender', label: 'Gender' },
      { key: 'age', label: 'Age' }
      ];
    this.state = {
      users: JSON.parse(localStorage.getItem('users')) || [],
      sortPreset: {
        col: null,
        dir: null
      },
      newUser: {},
    }
  }

  addUserData(field, value) {
    const u = this.state.newUser;
    this.setState({
      newUser: Object.assign(u, { [field]: value})
    });
  }

  addUser() {
    const users = [...this.state.users, this.state.newUser];
    this.setState({ users: users, newUser: {} });
    localStorage.setItem('users', JSON.stringify(users));
  }

  deleteUser(user) {
    const users = this.state.users.filter( item => item !== user);
    this.setState({ users: users });
    localStorage.setItem('users', JSON.stringify(users));
  }

  setSorting(obj) {
    this.setState({ sortPreset: obj });
  }

  render() {
    return (
      <div className='app-container'>
        <UserForm addUser={() => {this.addUser()}}
                  changeData={ (name, value) => { this.addUserData(name, value) }}
                  user={this.state.newUser}
        />
        <UserList users={this.state.users}
                  deleteUser={(user) => this.deleteUser(user)}
                  sortPresets={this.state.sortPreset}
                  setSortOrder={(obj) => this.setSorting(obj)}
                  cols={this.cols}/>
      </div>
    )
  }
}

ReactDOM.render(<App/>, document.getElementById('root'));
