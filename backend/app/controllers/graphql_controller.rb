require 'json'
class GraphqlController < ApplicationController
  def execute
    context = {
      # Query context goes here, for example:
      # current_user: current_user,
    }
    result = if params[:operations]
                param = JSON.parse(params[:operations])
                BackendSchema.execute(
                   param["query"],
                   operation_name: param["operationName"],
                   variables: { "file" => params["0"] },
                   context: context
                 )
              else
                BackendSchema.execute(
                   params[:query],
                   operation_name: params[:operationName],
                   variables: ensure_hash(params[:variables]),
                   context: context
                 )
               end
    #result = BackendSchema.execute(query, variables: variables, context: context, operation_name: operation_name)
    render json: result
  rescue => e
    raise e unless Rails.env.development?
    handle_error_in_development e
  end

  private

  # Handle form data, JSON body, or a blank value
  def ensure_hash(ambiguous_param)
    case ambiguous_param
    when String
      if ambiguous_param.present?
        ensure_hash(JSON.parse(ambiguous_param))
      else
        {}
      end
    when Hash, ActionController::Parameters
      ambiguous_param
    when nil
      {}
    else
      raise ArgumentError, "Unexpected parameter: #{ambiguous_param}"
    end
  end

  def handle_error_in_development(e)
    logger.error e.message
    logger.error e.backtrace.join("\n")

    render json: { error: { message: e.message, backtrace: e.backtrace }, data: {} }, status: 500
  end
end
