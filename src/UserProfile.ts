interface UserProfile {
  first_name: string;
  last_name?: string;
  profile_pic?: string;
  locale?: string;
  timezone?: number;
  gender?: string;
}

export const defaultUserProfile: UserProfile = {
  first_name: 'Default_user',
};

export default UserProfile;
