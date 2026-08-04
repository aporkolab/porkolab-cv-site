# frozen_string_literal: true

source "https://rubygems.org"

# Current Jekyll instead of the `github-pages` gem. That gem is frozen on Jekyll
# 3.10 and pulls in a dozen plugins this site does not use; its pinned dependency
# set also drifted out of sync with this lockfile, which is what produced the
# "github-pages gem can't satisfy your Gemfile's dependencies" build warning.
#
# The site is now built by .github/workflows/jekyll-gh-pages.yml with
# `bundle exec jekyll build`, so THIS file is the source of truth for the build —
# not GitHub's preinstalled bundle.
gem "jekyll", "~> 4.4"

# /feed.xml has been live for years. It used to arrive implicitly: minima's gemspec
# declares jekyll-feed as a runtime dependency and Jekyll auto-requires a theme's
# dependencies (PluginManager#require_theme_deps). With no theme it has to be
# declared here AND in _config.yml's `plugins:`, or the URL starts 404ing.
gem "jekyll-feed", "~> 0.17"

group :development do
  # Dropped from Ruby's stdlib in 3.0; `jekyll serve` needs it locally.
  gem "webrick", "~> 1.9"
end
