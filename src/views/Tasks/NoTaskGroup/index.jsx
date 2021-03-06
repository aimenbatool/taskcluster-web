import { hot } from 'react-hot-loader';
import { Component } from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import LinkIcon from 'mdi-react/LinkIcon';
import Dashboard from '../../../components/Dashboard';
import Search from '../../../components/Search';
import db from '../../../utils/db';

@hot(module)
@withStyles(theme => ({
  infoText: {
    marginBottom: theme.spacing.unit,
  },
  listItemButton: {
    ...theme.mixins.listItemButton,
  },
}))
export default class NoTaskGroup extends Component {
  state = {
    recentTaskGroups: null,
    taskGroupSearch: '',
  };

  async componentDidMount() {
    const recentTaskGroups = await db.taskGroupIdsHistory
      .limit(5)
      .reverse()
      .toArray();

    this.setState({ recentTaskGroups });
  }

  handleTaskGroupSearchChange = e => {
    this.setState({ taskGroupSearch: e.target.value || '' });
  };

  handleTaskGroupSearchSubmit = e => {
    e.preventDefault();
    this.props.history.push(`/tasks/groups/${this.state.taskGroupSearch}`);
  };

  render() {
    const { classes } = this.props;
    const { taskGroupSearch, recentTaskGroups } = this.state;

    return (
      <Dashboard
        search={
          <Search
            value={taskGroupSearch}
            onChange={this.handleTaskGroupSearchChange}
            onSubmit={this.handleTaskGroupSearchSubmit}
          />
        }>
        <Typography className={classes.infoText}>
          Enter a task group ID in the search box
        </Typography>
        {recentTaskGroups &&
          Boolean(recentTaskGroups.length) && (
            <List
              dense
              subheader={
                <ListSubheader component="div">
                  Recent Task Groups
                </ListSubheader>
              }>
              {recentTaskGroups.map(({ taskGroupId }) => (
                <ListItem
                  button
                  className={classes.listItemButton}
                  component={Link}
                  to={`/tasks/groups/${taskGroupId}`}
                  key={taskGroupId}>
                  <ListItemText primary={taskGroupId} />
                  <LinkIcon />
                </ListItem>
              ))}
            </List>
          )}
      </Dashboard>
    );
  }
}
