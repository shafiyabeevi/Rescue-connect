/* =====================================================================
   CUSTOM FILTERS
   ===================================================================== */

/* Used on: Volunteers page - search/filter volunteers by name or place */
rescueApp.filter('volunteerSearch', function () {
  return function (list, query) {
    if (!query) return list;
    query = query.toLowerCase();
    return (list || []).filter(function (v) {
      return (v.firstname + ' ' + v.lastname).toLowerCase().indexOf(query) !== -1 ||
             (v.place || '').toLowerCase().indexOf(query) !== -1;
    });
  };
});

/* Used on: Donation page, Fund Received page - format amount as Indian Rupees */
rescueApp.filter('inr', function () {
  return function (amount) {
    if (amount === undefined || amount === null) return '₹0';
    return '₹' + Number(amount).toLocaleString('en-IN');
  };
});

/* Used on: Leaderboard page - medal icon for top 3 ranks */
rescueApp.filter('rankBadge', function () {
  return function (index) {
    var badges = ['🥇', '🥈', '🥉'];
    return badges[index] || (index + 1) + '.';
  };
});

/* Used on: Notification page - relative "time ago" display */
rescueApp.filter('timeAgo', function () {
  return function (dateStr) {
    if (!dateStr) return '';
    var diffMs = new Date() - new Date(dateStr);
    var mins = Math.floor(diffMs / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return mins + ' min ago';
    var hrs = Math.floor(mins / 60);
    if (hrs < 24) return hrs + ' hr ago';
    return Math.floor(hrs / 24) + ' day(s) ago';
  };
});
