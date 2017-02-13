Rails.application.routes.draw do
  devise_for :users
  root to: 'users#index'
  devise_for :admins
  resources :location
  resources :challenges

end
