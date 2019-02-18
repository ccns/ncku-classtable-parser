const axios = require('axios');
const iconv = require('iconv-lite');
const querystring = require('querystring');
const axiosCookieJarSupport = require('axios-cookiejar-support').default;
const tough = require('tough-cookie');

axiosCookieJarSupport(axios);

const cookieJar = new tough.CookieJar();

axios.defaults.baseURL = 'https://course.ncku.edu.tw/course/';

var stu_no = '';
var passwd = '';
var id_no = 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3';

class LoginError extends Error {
  constructor(statusCode, data, ...params) {
    super(...params);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, LoginError);
    }
    this.status = statusCode;
    this.data = data;
  }
}

async function get(stu_no, passwd) {
  var form = querystring.stringify({
    stu_no: stu_no,
    passwd: passwd,
    // id_no: id_no
  })

  const response = await axios.get('login.php');
  if (response.status == 200) {
    await logout();
    await login(form);
    console.log( "Login status: Login success!" );
    const schedule_html = await getSchedule();
    await logout();
    return schedule_html;
  }
}

async function logout() {
  const response = await axios.get('logout.php', {
    responseType: 'arraybuffer',
    jar: cookieJar,
    withCredentials: true,
  });

  if (response.status == 200) {
    const data = iconv.decode(Buffer.from(response.data), "big5");
  } else {
    throw new LoginError(-1, data, "Logout failed.");
  }
}

async function login(form) {
  const response = await axios.post('login.php', form, {
    responseType: 'arraybuffer',
    jar: cookieJar,
    withCredentials: true,
  });

  if (response.status == 200) {
    const data = iconv.decode(Buffer.from(response.data), "big5");

    console.log("Login response length: " + data.length); // login success when str.length < 80
    if (data.length == 147 || data.length == 58) {
      return 0;
    } else if (data.length == 308) {
      console.log( "Login status: Double login, logout and login again" );
      await logout();
      return await login(form);
    } else if (data.length == 122 || data.length == 123) {
      throw new LoginError(1, data, "Login failed: Wrong username or password!");
    }else{
      throw new LoginError(2, data, "Login failed: Unknown condition.");
    }
  }
}

async function getSchedule() {
  const response = await axios.get('schedule.php', {
    responseType: 'arraybuffer',
    jar: cookieJar,
    withCredentials: true,
  });

  if (response.status == 200) {
    return iconv.decode(Buffer.from(response.data), "big5");
  }
}

module.exports = get;
