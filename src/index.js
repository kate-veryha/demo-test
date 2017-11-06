import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class UserForm extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    this.props.addUser();
    e.preventDefault();
  }

  handleChange(e) {
    const target = e.target;
    this.props.changeData(target.name, target.value)
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input name='firstName'
               onChange={ this.handleChange }
               placeholder='First name'/>
        <input name='lastName'
               onChange={ this.handleChange }
               placeholder='Last name'/>
        <input name='phone'
               onChange={ this.handleChange }
               placeholder='Phone'/>
        <div>
          <input name='gender'
                 type='radio'
                 checked
                 onChange={ this.handleChange }
                 value='male'/>Male
          <input name='gender'
                 type='radio'
                 onChange={ this.handleChange }
                 value='female'/>Female
        </div>
        <input name='age'
               placeholder='Age'
               type='number'
               onChange={ this.handleChange }
               min='0'
               max='120'/>
        <input type='submit'/>
      </form>
    )
  }
}

class UserList extends Component {
  generateCols() {
    const cols = this.props.cols;
    return cols.map((colData) =>
      <th key={colData.key}>
        {colData.label}<span onClick={()=>{this.props.changeSortOrder(colData.key)}}>&#8645;</span>
      </th>);
  }

  generateRows() {
    const cols = this.props.cols;
    const data = this.props.users;

    return data.map( item => {
      const cells = cols.map((col) => <td>{item[col.key]}</td> );
      return (<tr key={item.surname}>{cells}</tr>)
    });
  }

  render() {
    const headers = this.generateCols();
    const rows = this.generateRows();
    return (
      <table>
        <thead><tr>{headers}</tr></thead>
        <tbody>{rows}</tbody>
      </table>
    )
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.sortDirections = [1, -1, null];
    this.cols = [
      { key: 'firstName', label:'First name' },
      { key: 'lastName', label: 'Last name' },
      { key: 'phone', label: 'Phone' },
      { key:'gender', label: 'Gender' },
      { key: 'age', label: 'Age' }
      ];
    this.state = {
      users: [{
        firstName: 'Ali',
        lastName: 'Muhammad',
        phone: '12345',
        gender: 'Male',
        age: 34,
      }, {
        firstName: 'Ken',
        lastName: 'Ken',
        phone: '987654',
        gender: 'Male',
        age: '84',
      }, {
        firstName: 'Zozo',
        lastName: 'Deli',
        phone: '47654',
        gender: 'Female',
        age: 83,
      }, {
        firstName: 'Mia',
        lastName: 'Zalevska',
        phone: '349474',
        gender: 'Female',
        age: 10,
      }],
      sortPreset: {
        col: null,
        dir: null
      },
      newUser: {},
    }
  }

  sortCompareFunction(a, b) {
    const aSort = a[this.state.sortPreset.col].toString().toLowerCase();
    const bSort = b[this.state.sortPreset.col].toString().toLowerCase();
    if (aSort < bSort) {
      return -1 * this.state.sortPreset.dir;
    }
    if (aSort > bSort) {
      return 1 * this.state.sortPreset.dir;
    }
    return 0;
  }

  changeOrder(col) {
    const set = {
      col: col,
      dir: (col === this.state.sortPreset.col)
        ? this.next(this.sortDirections, this.state.sortPreset.dir)
        : this.sortDirections[0]
    };
    this.setState({ sortPreset: set});
  }

  next(array, currentElem) {
    const nextElemIndex = array.findIndex((elem) => elem === currentElem) + 1;
    return array[nextElemIndex !== array.length ? nextElemIndex : 0];
  }

  addUserData(field, value) {
    const u = this.state.newUser;
    this.setState({
      newUser: Object.assign(u, { [field]: value})
    });
    console.log(this.state.newUser);
  }

  addUser() {
    this.setState({ users: [...this.state.users, this.state.newUser] , newUser: {}});
  }

  render() {
    const renderedUsers = (this.state.sortPreset.dir === null)
      ? this.state.users
      :this.state.users.slice().sort(this.sortCompareFunction.bind(this));
    console.log(this.state.sortPreset);
    return (
      <div className='app-container'>
        <UserForm addUser={() => {this.addUser()}} changeData={ (name, value) => { this.addUserData(name, value) }}/>
        <UserList users={renderedUsers}
                  changeSortOrder={(col) => this.changeOrder(col)}
                  cols={this.cols}/>
      </div>
    )
  }
}

ReactDOM.render(<App/>, document.getElementById('root'));
