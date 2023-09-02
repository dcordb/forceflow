import { Text } from "ink";

const SuccessMessage = ({ msg }) => <Text color="green">{msg}</Text>;
const ErrorMessage = ({ msg }) => <Text color="red">{msg}</Text>;

export { SuccessMessage, ErrorMessage };
