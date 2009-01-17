require 'rubygems'
require 'feed-normalizer'

class FeedController < ApplicationController

    def entries

        feed_url = 'http://rss.slashdot.org/Slashdot/slashdot'
        rss = FeedNormalizer::FeedNormalizer.parse open(feed_url)

        exit unless rss.entries.length > 0

        rss.entries.each do |entry|
            title = entry.title
            body = entry.content
            authors = entry.authors.join(', ') rescue ''
            entry_url = entry.urls.first
        end

        render :text => rss.entries[0,5].to_json
    end
end
