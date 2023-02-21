import { fireEvent, render, screen } from "@testing-library/react";
import { UserCard } from "./UserCard";

it("renders a user card and checks its callback button", () => {
  const login = "login"
  const avatar = "avatar"
  const callback = jest.fn()

  render(<UserCard login={login} avatar={avatar} onSignOut={callback} />);
  expect(screen.getByText(login)).toBeInTheDocument();
  expect(screen.getByRole("img")).toBeInTheDocument();

  const button = screen.getByRole("button")
  expect(button).toBeEnabled()

  expect(callback.mock.calls).toHaveLength(0)
  fireEvent.click(button)
  expect(callback.mock.calls).toHaveLength(1)
});
