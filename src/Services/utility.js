import moment from "moment/moment";

export const formatDate = (date, format) => {
  return moment(date).format(format);
};
