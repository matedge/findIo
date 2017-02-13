Rails.application.routes.draw do
  resources :locations
  devise_for :admins
  root to: 'admin#index'

  resources :challenges
end
