const axios = require("axios");

exports.is_authenticated_middleware = (req, res, next) => {
  if (req.session.authenticated) {
    if (
      req.session.auth_token_expire_at !== undefined &&
      moment(req.session.auth_token_expire_at).isBefore()
    ) {
      return res.redirect("/refresh_token");
    }

    let token = req.session.auth_access_token;

    axios.defaults.headers.common = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    return next();
  }

  return res.redirect("/login");
};

exports.login = (req, data) => {
  req.session.authenticated = true;
  req.session.auth_access_token = data.access_token;
  req.session.auth_token_expire_at = moment().add(data.expires_in, "s");
  req.session.auth_refresh_token = data.refresh_token;
};

exports.logout = (req) => {
  req.session.destroy();
};

exports.parse_get_events = (data) => {
  let groups = data.self.memberships.edges.filter((group) => {
    return group.node.isOrganizer === true;
  });

  let events = [];

  let event_groups_map = {};

  groups.forEach((group) => {
    group.node.unifiedUpcomingEvents.edges.forEach((event) => {
      let groups_already_in = event_groups_map[event.node.title];

      if (groups_already_in === undefined) {
        event_groups_map[event.node.title] = [
          {
            id: group.node.id,
            name: group.node.name,
            event_id: event.node.id.replace(/\D/g, ""),
            urlname: group.node.urlname,
          },
        ];
      } else {
        groups_already_in.push({
          id: group.node.id,
          name: group.node.name,
          event_id: event.node.id.replace(/\D/g, ""),
          urlname: group.node.urlname,
        });
        event_groups_map[event.node.title] = groups_already_in;
      }
    });
  });

  Object.keys(event_groups_map).forEach((title) => {
    events.push({ title: title, groups: event_groups_map[title] });
  });

  return { groups, events, event_groups_map };
};

exports.axios = axios;

exports.root_path = __dirname;