Rails.application.routes.draw do
  devise_for :users
  root to: 'users#index'
  resources :locations
  devise_for :admins
  resources :challenges

end
