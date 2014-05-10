# encoding: utf-8

require "sinatra"
# require "sinatra/reloader" if development?
require "sinatra/reloader" 

configure do
  mime_type :peg, 'text/peg'
  mime_type :'قلب', 'text/قلب'
end

get '/' do
  content_type :html, 'charset' => 'utf-8'
  send_file "public/repl.html"
end

get '/editor' do
  content_type :html, 'charset' => 'utf-8'
  send_file "public/editor.html"
end

get '/hello' do
	"hello world"
end
#  vim: set et fenc=utf-8 ff=unix sts=4 sw=4 ts=4 : 
