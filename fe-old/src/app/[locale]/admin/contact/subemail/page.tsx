import ContactManager from "../contactManager";

export default function OnlyEmailContacts() {
  return (
    <ContactManager title="Email đăng ký nhận tin" filterMode="emailOnly" />
  );
}
