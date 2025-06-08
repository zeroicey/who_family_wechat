import request from "./request";

export const fetchRecruitTypes = async () => {
  return request.get("/hire/job-types");
};

export const fetchRecruits = async () => {
  return request.get("/hire/recommend-jobs");
};

export const fetchMoreRecruits = async (lastId) => {
  return request.get(`/hire/recommend-jobs?lastId=${lastId}`);
};

export const fetchRecruitById = async (recruitId) => {
  return request.get(`/hire/job?id=${recruitId}`);
};

export const collectRecruit = async (recruitId) => {
  return request.post("/hire/collect-job", { id: recruitId, collect: true });
};

export const uncollectRecruit = async (recruitId) => {
  return request.post("/hire/collect-job", { id: recruitId, collect: false });
};

export const deliveryJob = async (recruitId) => {
  return request.post("/hire/submit", { id: recruitId });
};
