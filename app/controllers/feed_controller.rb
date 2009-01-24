require 'rubygems'
require 'feed-normalizer'

class FeedController < ApplicationController

    def entries

        feed_url = APP_CONFIG['feed']

        begin
            rss = FeedNormalizer::FeedNormalizer.parse open(feed_url)
            exit unless rss.entries.length > 0

            @feeds = Array.new
            rss.entries.each do |entry|
                feed = Hash.new
                feed[:title] = entry.title.match(/File: (.*) Thread: (.*)/)[1]
                feed[:link] = entry.urls.first
                @feeds << feed
            end
            render :text => @feeds[0,APP_CONFIG['max_rss_entries']].to_json
        rescue OpenURI::HTTPError
            render :text => []
        end

    end
end
