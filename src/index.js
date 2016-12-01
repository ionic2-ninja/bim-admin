import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import Layout from './pages/layout/Layout';
import ProjectList from './pages/ProjectList';
import IssueList from './pages/IssueList';

import './index.css';

ReactDOM.render(
  (
    <Router history={browserHistory}>
      <Route path="/" component={Layout}>
        <IndexRoute component={ProjectList}/>
        <Route path="projects" component={ProjectList}/>
        <Route path="issues" component={IssueList}/>
        <Route path="*" component={ProjectList}/>
      </Route>
    </Router>
  ),
  document.getElementById('root')
);
