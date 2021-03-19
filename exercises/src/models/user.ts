import { observable } from 'mobx';

class User {

  @observable id;
  @observable username;
  @observable faculty_status;
  @observable first_name;
  @observable full_name;
  @observable last_name;
  @observable self_reported_role;
  @observable support_identifier;

  bootstrap(data) {
      Object.assign(this, data);
  }

}

const currentUser = new User;

export { User };
export default currentUser;
