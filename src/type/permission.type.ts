import PostPermission from 'src/enums/postPermission.enum';
import UserPermission from 'src/enums/userPermission.enum';

const Permission = {
  ...PostPermission,
  ...UserPermission,
};

type Permission = PostPermission | UserPermission;

export default Permission;
