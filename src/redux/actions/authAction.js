export const GET_PROFILE = "GET_PROFILE";
export const GET_VERSION = "GET_VERSION";
export const updateProfile = (profile) => {
  return {
    type: GET_PROFILE,
    payload: {
      profile: profile,
    },
  };
};