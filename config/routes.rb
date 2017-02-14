Rails.application.routes.draw do
  devise_for :users
  root to: 'pages#landing'
  resources :locations
  resources :users
  devise_for :admins
  resources :challenges

end
