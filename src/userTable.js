import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Paper from 'material-ui/Paper';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

import './index.css';
import trashImg from './delete-button.svg';

const styles = {
  paper: {
    width: '60%',
    marginLeft: '5%',
  },
  table: {
    height: '400px',
  },
  tableHeader: {
    cursor: 'pointer',
  },
  svg: {
    width: 20,
  }
};

const ClickableTableRowColumn = (props) => {
  // Wrapper to add onMouseDown handler
  // Needed because original lib component has issues
  const {rowData, ...restProps} = props;
  return (
    <TableRowColumn
      {...restProps}
      onMouseDown={props.onMouseDown}>
    </TableRowColumn>
  )
};

const ClickableTableHeaderColumn = (props) => {
  const {order, ...restProps} = props;
  const arrows = {
    '1': '\u2191',
    '-1': '\u2193',
    'null': ''
  };
  return (
    <TableHeaderColumn
      {...restProps}
      onMouseDown={props.onMouseDown}
    >
      {props.children}
      <span>{arrows[order]}</span>
    </TableHeaderColumn>)
};

export default class UserTable extends Component {
  constructor(props) {
    super(props);
    this.sortDirections = [1, -1, null];
  }

  generateCols() {
    const cols = this.props.cols;
    const sort = this.props.sortPresets;
    return cols.map((colData) =>
      <ClickableTableHeaderColumn key={colData.key}
                                  order={(sort.col === colData.key) ? this.props.sortPresets.dir : null}
                                  style={styles.tableHeader}
                                  tooltip='Click to sort'
                                  onMouseDown={() => { this.changeSortOrder(colData.key) }}>
        {colData.label}
      </ClickableTableHeaderColumn>);
  }

  handleClickDelete(item) {
    this.props.deleteUser(item);
  }

  sortCompareFunction(a, b) {
    const aSort = a[this.props.sortPresets.col].toString().toLowerCase();
    const bSort = b[this.props.sortPresets.col].toString().toLowerCase();
    if (aSort < bSort) {
      return -1 * this.props.sortPresets.dir;
    }
    if (aSort > bSort) {
      return 1 * this.props.sortPresets.dir;
    }
    return 0;
  }

  next(array, currentElem) {
    const nextElemIndex = array.findIndex((elem) => elem === currentElem) + 1;
    return array[nextElemIndex !== array.length ? nextElemIndex : 0];
  }

  changeSortOrder(col) {
    debugger;
    const set = {
      col: col,
      dir: (col === this.props.sortPresets.col)
        ? this.next(this.sortDirections, this.props.sortPresets.dir)
        : this.sortDirections[0]
    };
    this.props.setSortOrder(set);
  }

  generateRows(users) {
    const cols = this.props.cols;
    return users.map( item => {
      const cells = cols.map((col) => <TableRowColumn>{item[col.key]}</TableRowColumn> );
      return (<TableRow key={item.surname}
                        className='table-row'>{cells}
                        <ClickableTableRowColumn className='delete-button'
                                                 onMouseDown={ this.handleClickDelete.bind(this, item) }
                                                 rowData={item}>
                          <img src={trashImg} alt='Delete button' style={styles.svg}/>
                        </ClickableTableRowColumn>
      </TableRow>)
    });
  }

  render() {
    const renderedUsers = (this.props.sortPresets.dir === null)
      ? this.props.users
      : this.props.users.slice().sort(this.sortCompareFunction.bind(this));
    const headers = this.generateCols();
    const rows = this.generateRows(renderedUsers);
    return (
      <MuiThemeProvider>
        <Paper zDepth={2} style={styles.paper}>
          <Table height={styles.table.height}>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
              <TableRow>{headers}<TableHeaderColumn>To trash</TableHeaderColumn></TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
              {rows}
            </TableBody>
          </Table>
        </Paper>
      </MuiThemeProvider>
    )
  }
}

UserTable.PropTypes = {
  users: PropTypes.arrayOf(PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    phone: PropTypes.string,
    gender: PropTypes.string,
    age: PropTypes.string,
  })),
  deleteUser: PropTypes.func,
  sortPresets: PropTypes.any,
  setSortOrder: PropTypes.func,
  cols: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string,
    label: PropTypes.string,
  }))
};
