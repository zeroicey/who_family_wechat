/**
 * 获取学生成绩
 * @param {string} studentNo - 学号
 * @param {string} password - 密码
 * @param {string} term - 学期
 * @returns {Promise} 成绩数据
 */
export const fetchSchoolGrades = async (studentNo, password, term) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: "https://api.hcyj.xyz/yeciorez/neusoft/grades",
      method: "GET",
      data: {
        studentNo,
        password,
        term,
      },
      success: (res) => {
        if (res.statusCode === 200) {
          console.log(res.data);
          resolve(res.data);
        } else {
          console.error("获取成绩失败:", res);
          reject(res.data || "获取成绩失败");
        }
      },
      fail: (error) => {
        console.error("获取成绩失败:", error);
        reject(error);
      },
    });
  });
};

/**
 * 获取学生课程
 * @param {string} studentNo - 学号
 * @param {string} password - 密码
 * @param {string} term - 学期
 * @param {string} week - 周次
 * @returns {Promise} 课程数据
 */
export const fetchSchoolCourses = async (studentNo, password, term, week) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: "https://api.hcyj.xyz/yeciorez/neusoft/schedule",
      method: "GET",
      data: {
        studentNo,
        password,
        term,
        week,
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          console.error("获取课程失败:", res);
          reject(res.data || "获取课程失败");
        }
      },
      fail: (error) => {
        console.error("获取课程失败:", error);
        reject(error);
      },
    });
  });
};
