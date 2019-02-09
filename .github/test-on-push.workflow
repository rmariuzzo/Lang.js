workflow "Test on Push" {
  on = "push"
  resolves = ["Run Tests"]
}

action "Install Dependencies" {
  uses = "actions/npm@master"
  runs = "npm"
  args = "install"
}

action "Run Tests" {
  uses = "actions/npm@master"
  runs = "npm"
  args = "test"
  needs = ["Install Dependencies"]
}
