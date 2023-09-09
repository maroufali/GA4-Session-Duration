<script>
var GTMSessionDuration = function() {
  
  // Some settings
  this.settings = {
    minuteMarkers: ["2:10"],
    sessionExpires: 30
  };
  
  // Check duration every 1000ms
  setInterval(this.checkDuration.bind(this), 1000);
};
  
GTMSessionDuration.prototype.checkDuration = function() {
  
  // Stop if tab is inactive
  if (document.hidden) return;
  
  // Get last session duration from cookie or start from 0
  var durationSeconds = this.readCookie('ga_session_duration') || 0;
  
  // Convert into number
  durationSeconds = parseInt(durationSeconds);  
  
  // Save session duration + 1 sec
  this.createCookie('ga_session_duration', durationSeconds + 1, this.settings.sessionExpires);
  
  // Convert session duration into minutes and seconds
  var durationMinutes = Math.floor(durationSeconds / 60);
  var durationSecondsRemainder = durationSeconds % 60;
  var durationFormatted = durationMinutes + ':' + (durationSecondsRemainder < 10 ? '0' : '') + durationSecondsRemainder;
  
  // Push to dataLayer if duration is exactly in minute marker list
  if (this.settings.minuteMarkers.indexOf(durationFormatted) !== -1) {
    this.dataLayerPush(durationFormatted);
  }
};
  
GTMSessionDuration.prototype.dataLayerPush = function(durationFormatted) {
  
  dataLayer.push({
    'event': 'session_duration_conv',
    'session_duration_minutes': durationFormatted
  });
};

GTMSessionDuration.prototype.createCookie = function(name, value, minutes) {
  if (minutes) {
    var date = new Date();
    date.setTime(date.getTime() + (minutes * 60 * 1000));
    var expires = "; expires=" + date.toGMTString();
  } else {
    var expires = "";
  }
  document.cookie = name + "=" + value + expires + "; path=/";
};

GTMSessionDuration.prototype.readCookie = function(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};
  
var gtmSessionDuration = new GTMSessionDuration();
</script>
