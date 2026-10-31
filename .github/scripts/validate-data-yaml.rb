# frozen_string_literal: true

# The external CV generator sometimes leaks its stdout debug output into
# _data/*.yml, which kills the whole Pages build. Parse as-is; only if that
# fails, drop the leading noise lines until the file parses as a mapping
# again. Build-time only, the committed file is untouched.
#
# Usage: ruby .github/scripts/validate-data-yaml.rb _data/*.yml
require "yaml"

NOISE = /\A(?:===|[A-Z][A-Z0-9_]{2,}\s*:|Traceback\b)/

def parse(src)
  doc = YAML.unsafe_load(src)
  doc.is_a?(Hash) ? doc : nil
rescue Psych::SyntaxError
  nil
end

ARGV.each do |path|
  src = File.read(path)
  next if parse(src)

  lines = src.lines
  limit = [lines.size - 1, 50].min
  # Every discarded line must itself look like generator noise. Without
  # that check any syntax error in the first 50 lines would amputate the
  # document down to whatever suffix happens to parse, and ship it.
  cut = (1..limit).find do |n|
    lines[0...n].all? { |l| l.match?(NOISE) } && !lines[n].match?(NOISE) && parse(lines[n..].join)
  end
  unless cut
    warn "::error file=#{path}::Invalid YAML and no recognizable debug preamble in the first #{limit} lines"
    exit 1
  end
  File.write(path, lines[cut..].join)
  warn "::warning file=#{path}::Stripped #{cut} non-YAML preamble line(s) written by the CV generator. " \
       "Fix the generator: it must not write debug output to the stream it redirects into this file."
end
