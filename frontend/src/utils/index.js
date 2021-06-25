import moment from 'moment';

export const avatars = [
  'https://avatars1.githubusercontent.com/u/8186664?s=460&v=4',
  'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
  'https://icon-library.com/images/avatar-icon-images/avatar-icon-images-7.jpg',
  'https://www.fountain.org.tw/upload/repository/74a7f73b7f18d193ddebff71c0b8afeaimage_normal.jpg',
  'https://www.clipartmax.com/png/small/100-1005846_waiter-free-icon-avatar-profile-circle-png.png',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTA1scdWn695DaLFJtUys2DIJjqM2bbq4cM1Q&usqp=CAU',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPXMEJXE7EIryuqbSSwMV0rWEB6Zz0ehJiug&usqp=CAU', 
];
export const standardAvatar = 'https://www.clipartmax.com/png/small/100-1005846_waiter-free-icon-avatar-profile-circle-png.png';

export const isNull = (value, default_) => { 
    return value===null?default_:value 
};

export const makeShorter = (s, max_len=10) => {
  return (s.length<max_len) ? s : s.substring(0, max_len)+'...';
}

export const timeConverter = (UNIX_timestamp, date_only=false) => {
  // UNIX_timestamp = parseInt(UNIX_timestamp);
  var a = new Date(UNIX_timestamp);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  if (date_only)
    return date + ' ' + month + ' ' + year ;
  else
    return date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
}

export const getMoment = (timeString) => {
    return moment(timeString).fromNow();
    // console.log(moment(timestamp).fromNow());
    // console.log(moment.unix(parseInt(timestamp)).fromNow())
    // return moment().subtract(timestamp, 'secs').fromNow();
}

export const showQuestionCreateUpdateTime = (questionData) => {
    if (questionData.question.updatedAt === questionData.question.createdAt)
        return "created " + getMoment(questionData.question.createdAt);
    else
        return "updated " + getMoment(questionData.question.updatedAt);
}
